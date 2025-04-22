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
    if (file.type !== 'application/json') {
         displayMessage('> ERROR: Invalid file type. Must be JSON.', 'error');
         fileInput.value = ''; return;
    }

    const formData = new FormData();
    formData.append('magazineDataFile', file);

    displayMessage('> PROCESSING: Uploading transmission data...', '');
    submitButton.disabled = true;

    try {
        const response = await fetch('/upload', { method: 'POST', body: formData });
        let result;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            const errorText = await response.text();
            result = { success: false, message: errorText || `Server error (Status: ${response.status})` };
             console.error("Non-JSON response:", errorText);
        }

        if (response.ok && result.success) {
            displayMessage(`> SUCCESS: ${result.message || 'Upload complete.'}`, 'success');
            fileInput.value = '';
        } else {
            const errorMsg = result.message || `Upload failed (Status: ${response.status}). Check server logs/file.`;
            displayMessage(`> ERROR: ${errorMsg}`, 'error');
             console.error("Upload failed:", result);
        }
    } catch (error) {
        console.error('Network/Fetch Error:', error);
        displayMessage('> ERROR: Network connection failed or server unreachable.', 'error');
    } finally {
        submitButton.disabled = false;
    }
});

function displayMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
}
