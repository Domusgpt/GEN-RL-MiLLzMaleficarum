const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE_PATH = path.join(DATA_DIR, 'current_magazine_data.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

if (!fs.existsSync(DATA_DIR)){ try { fs.mkdirSync(DATA_DIR); console.log(`Created data directory: ${DATA_DIR}`); } catch(err){ console.error(`Error creating data dir: ${err}`); process.exit(1);}}
if (!fs.existsSync(DATA_FILE_PATH)) { const initialData = { cycleNumber: 0, transmissionDate: "INITIALIZING :: STANDBY", layoutConfiguration: { templateName: "standard-grid", featuredVisualTargetId: "init-directive", moduleOrder: ["init-directive"] }, mainContent: [{type: "directive", id:"init-directive", title:"// STANDBY :: AWAITING TRANSMISSION //", content:"<p>Channel open. Awaiting first operational directive...</p>"}], footerMantra: "// SYSTEM ONLINE :: AWAIT SIGNAL //", styleOverrides: {} }; try { fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(initialData, null, 2), 'utf8'); console.log(`Created initial data file: ${DATA_FILE_PATH}`); } catch (err) { console.error(`Failed to create initial data file: ${err}`); }}

app.use(cors());
app.use(express.json());
app.get('/dashboard', (req, res) => { res.sendFile(path.join(PUBLIC_DIR, 'dashboard.html')); });
app.use(express.static(PUBLIC_DIR));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, cb) => { file.mimetype === 'application/json' ? cb(null, true) : cb(new Error('Invalid file type.'), false); } });

app.post('/upload', upload.single('magazineDataFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
    try {
        const parsedData = JSON.parse(req.file.buffer.toString('utf8'));
        const requiredKeys = ['cycleNumber', 'transmissionDate', 'layoutConfiguration', 'mainContent', 'footerMantra', 'styleOverrides'];
        if (!requiredKeys.every(key => parsedData.hasOwnProperty(key)) || !Array.isArray(parsedData.mainContent)) throw new Error('Invalid JSON structure: Missing keys or invalid mainContent.');
        if (parsedData.mainContent.some(item => !item || typeof item !== 'object' || !item.id || !item.type)) throw new Error('Invalid JSON: mainContent items require "id" and "type".');
        if (parsedData.layoutConfiguration?.featuredVisualTargetId && !parsedData.mainContent.some(item => item.id === parsedData.layoutConfiguration.featuredVisualTargetId)) console.warn(`Warning: Uploaded featuredVisualTargetId "${parsedData.layoutConfiguration.featuredVisualTargetId}" not found.`);
        fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(parsedData, null, 2), 'utf8');
        console.log(`Success: Updated ${path.basename(DATA_FILE_PATH)} with Cycle ${parsedData.cycleNumber}`);
        res.status(200).json({ success: true, message: `Data for Cycle ${parsedData.cycleNumber} uploaded!` });
    } catch (error) {
        console.error('Upload Error:', error.message);
        let status = 500, message = 'Server error processing file.';
        if (error instanceof SyntaxError) { status = 400; message = 'Invalid JSON format.'; }
        else if (error.message.includes('Invalid file type')) { status = 400; message = error.message; }
        else if (error.message.includes('Invalid JSON')) { status = 400; message = error.message; }
        res.status(status).json({ success: false, message: message });
    }
});

app.get('/api/current-data', (req, res) => {
    try {
        if (!fs.existsSync(DATA_FILE_PATH)) { console.error(`API Error: Data file not found at ${DATA_FILE_PATH}`); return res.status(404).json({ message: 'Magazine data file not found.' }); }
        res.setHeader('Content-Type', 'application/json');
        fs.createReadStream(DATA_FILE_PATH).pipe(res);
    } catch (error) { console.error('API Error reading data file:', error); res.status(500).json({ message: 'Error retrieving magazine data.' }); }
});

app.get('*', (req, res, next) => { // Modified catch-all
    if (!req.path.startsWith('/api/') && req.path !== '/upload' && req.path !== '/dashboard' && !req.path.includes('.')) {
        res.sendFile(path.join(PUBLIC_DIR, 'index.html'), (err) => { if (err) { next(err); } }); // Pass error to handler
    } else {
        next(); // Let static handler or 404 handler take over
    }
});

app.use((err, req, res, next) => {
    console.error("Unhandled Application Error:", err.stack || err);
    if (!res.headersSent) { // Avoid sending multiple responses
         if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') { return res.status(400).json({ success: false, message: 'File too large. Limit 5MB.' }); }
         else if (err.message && err.message.includes('Invalid file type')) { return res.status(400).json({ success: false, message: err.message }); }
         res.status(500).send('Internal Server Error!');
    }
});

app.listen(PORT, () => { console.log(`\n--- GEN-R-L MiLLz Backend --- Listening on ${PORT} ---`); console.log(`Data File: ${DATA_FILE_PATH}`); });
