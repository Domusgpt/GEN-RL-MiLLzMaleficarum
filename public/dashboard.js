const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('magazineDataFile');
const statusMessage = document.getElementById('statusMessage');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!fileInput.files || fileInput.files.length === 0) {
        displayMessage('> ERROR: No file selected.', 'error'); return;
    }
    const file = fileInput.files[0];
    // Basic client-side type check
    if (file.type !== 'application/json') {
         displayMessage('> ERROR: Invalid file type. Please select a .json file.', 'error');
         fileInput.value = ''; // Clear invalid selection
         return;
    }

    const formData = new FormData();
    formData.append('magazineDataFile', file); // Key must match 'upload.single' in server.js

    displayMessage('> PROCESSING: Uploading transmission data...', '');
    submitButton.disabled = true;

    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });

        // Try to parse JSON, but handle cases where server might send text (like errors)
        let result;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            result = await response.json();
        } else {
            // If not JSON, get text and assume it's an error message from server/proxy
            const errorText = await response.text();
            result = { success: false, message: errorText || `Server returned non-JSON response (Status: ${response.status})` };
             console.error("Non-JSON response received:", errorText);
        }


        if (response.ok && result.success) {
            displayMessage(`> SUCCESS: ${result.message || 'Upload complete.'}`, 'success');
            fileInput.value = ''; // Clear input on success
        } else {
            // Use message from parsed result or provide default
            const errorMsg = result.message || `Upload failed (Status: ${response.status}). Check server logs or file format.`;
            displayMessage(`> ERROR: ${errorMsg}`, 'error');
             console.error("Upload failed:", result);
        }
    } catch (error) {
        // Catch network errors or issues before getting response
        console.error('Network/Fetch Error during upload:', error);
        displayMessage('> ERROR: Network connection failed or server unreachable.', 'error');
    } finally {
        submitButton.disabled = false; // Re-enable button regardless of outcome
    }
});

function displayMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type; // Applies 'success' or 'error' class
}
