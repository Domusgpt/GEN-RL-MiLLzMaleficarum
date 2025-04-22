const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// Azure App Service for Containers expects the app to listen on port 8080
const PORT = process.env.PORT || 8080;

// --- Configuration ---
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'current_magazine_data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// --- Ensure data directory exists ---
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR);
        console.log(`Created data directory: ${DATA_DIR}`);
    } catch (err) {
        console.error(`Error creating data directory: ${err}`);
        process.exit(1); // Exit if cannot create data dir
    }
}

// --- Ensure initial data file exists ---
if (!fs.existsSync(DATA_FILE_PATH)) {
    const initialData = {
        cycleNumber: 0,
        transmissionDate: "INITIALIZING :: STANDBY",
        layoutConfiguration: { templateName: "standard-grid", featuredVisualTargetId: "init-directive", moduleOrder: ["init-directive"] },
        mainContent: [{type: "directive", id:"init-directive", title:"// STANDBY :: AWAITING TRANSMISSION //", content:"<p>Channel open. Awaiting first operational directive from Central Command...</p>"}],
        footerMantra: "// SYSTEM ONLINE :: AWAITING SIGNAL //",
        styleOverrides: {}
    };
    try {
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf8');
        console.log(`Created initial data file: ${DATA_FILE_PATH}`);
    } catch (err) {
        console.error(`Failed to create initial data file: ${err}`);
        // Continue running, API will fail until a file is uploaded
    }
}


// --- Middleware ---
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Serve dashboard specific files FIRST if they are in a subfolder
// If dashboard.html/js are directly in /public, these aren't strictly needed
// app.use('/dashboard_assets', express.static(path.join(PUBLIC_DIR, 'dashboard_assets')));

// Explicit route for dashboard HTML
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'dashboard.html'));
});

// Serve ALL static files from 'public' (including dashboard.js, style.css etc.)
// This needs to come AFTER specific dashboard routes if files might overlap
app.use(express.static(PUBLIC_DIR));


// --- Multer Setup ---
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/json') {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JSON is allowed.'), false);
        }
    }
});

// --- API Routes ---

// Upload Endpoint
app.post('/upload', upload.single('magazineDataFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    try {
        const parsedData = JSON.parse(req.file.buffer.toString('utf8'));

        // Basic Validation (expand as needed)
        const requiredKeys = ['cycleNumber', 'transmissionDate', 'layoutConfiguration', 'mainContent', 'footerMantra', 'styleOverrides'];
        if (!requiredKeys.every(key => parsedData.hasOwnProperty(key)) || !Array.isArray(parsedData.mainContent)) {
             throw new Error('Invalid JSON structure: Missing required keys or invalid mainContent.');
        }
         if (parsedData.mainContent.some(item => !item || typeof item !== 'object' || !item.id || !item.type)) {
             throw new Error('Invalid JSON: mainContent items require "id" and "type".');
        }
         // Optional: Check if featuredVisualTargetId exists
         if (parsedData.layoutConfiguration?.featuredVisualTargetId &&
            !parsedData.mainContent.some(item => item.id === parsedData.layoutConfiguration.featuredVisualTargetId)) {
                console.warn(`Warning: Uploaded featuredVisualTargetId "${parsedData.layoutConfiguration.featuredVisualTargetId}" not found in mainContent.`);
         }

        // Save Data (Synchronous for simplicity, consider async for robustness)
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(parsedData, null, 2), 'utf8');
        console.log(`Success: Updated ${path.basename(DATA_FILE_PATH)} with Cycle ${parsedData.cycleNumber}`);
        res.status(200).json({ success: true, message: `Data for Cycle ${parsedData.cycleNumber} uploaded!` });

    } catch (error) {
        console.error('Upload Error:', error.message);
        let status = 500, message = 'Server error processing file.';
        if (error instanceof SyntaxError) { status = 400; message = 'Invalid JSON format.'; }
        else if (error.message.includes('Invalid file type')) { status = 400; message = error.message; }
        else if (error.message.includes('Invalid JSON')) { status = 400; message = error.message; } // Catch specific validation errors
        res.status(status).json({ success: false, message: message });
    }
});

// API Endpoint to get current data
app.get('/api/current-data', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) {
             console.error(`API Error: Data file not found at ${DATA_FILE_PATH}`);
             return res.status(404).json({ message: 'Magazine data file not found.' });
        }
        // Send the raw JSON content efficiently
        res.setHeader('Content-Type', 'application/json');
        fs.createReadStream(DATA_FILE_PATH).pipe(res);
    } catch (error) {
        console.error('API Error reading data file:', error);
        res.status(500).json({ message: 'Error retrieving magazine data.' });
    }
});

// Catch-all for the Live Magazine Frontend (Client-Side Routing Support)
// THIS MUST BE THE LAST 'GET' ROUTE
app.get('*', (req, res) => {
    // Avoid serving index.html for API calls, upload, or dashboard path itself
     if (!req.path.startsWith('/api/') && req.path !== '/upload' && req.path !== '/dashboard') {
        res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (err) => {
            if (err) {
                 console.error(`Error sending index.html for path ${req.path}:`, err);
                 res.status(500).send("Error loading application.");
            }
        });
     } else {
         // Let previous routes handle it, or fall through (Express will 404)
         // We add an explicit 404 handler next for clarity
         res.status(404).send('Resource Not Found');
     }
});


// --- Error Handling Middleware (Catch-all) ---
app.use((err, req, res, next) => {
    console.error("Unhandled Application Error:", err.stack || err);
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
       return res.status(400).json({ success: false, message: 'File too large. Limit 5MB.' });
    } else if (err.message && err.message.includes('Invalid file type')) {
       return res.status(400).json({ success: false, message: err.message });
    }
    // Avoid sending stack trace in production
    res.status(500).send('Internal Server Error!');
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`\n--- GEN-R-L MiLLz Magazine Backend ---`);
    console.log(`Server listening on port ${PORT}`);
    console.log(`Live Magazine Root: http://localhost:${PORT}/`);
    console.log(`Dashboard: http://localhost:${PORT}/dashboard`);
    console.log(`API: http://localhost:${PORT}/api/current-data`);
    console.log(`Data File: ${DATA_FILE_PATH}`);
    console.log("Ensure initial data file exists or upload one via dashboard.");
});
