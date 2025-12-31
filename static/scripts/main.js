// Load file list on page load
loadFiles();

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('uploadStatus');
    
    if (!fileInput.files.length) {
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ ERROR: Please select a file';
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusDiv.className = 'status success';
            statusDiv.textContent = '✓ SUCCESS: File uploaded!';
            fileInput.value = '';
            loadFiles();
        } else {
            throw new Error('Upload failed');
        }
    } catch (error) {
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ ERROR: ' + error.message;
    }
}

async function loadFiles() {
    const statusDiv = document.getElementById('uploadStatus');

    try {
        const response = await fetch('/list');
        const files = await response.json();
        
        const fileListDiv = document.getElementById('fileList');
        fileListDiv.innerHTML = '';

        if (files.length === 0) {
            fileListDiv.innerHTML = '<div style="padding: 15px; text-align: center; opacity: 0.6;">No files available</div>';
            return;
        }

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>► ${file}</span>
                <button class="download-btn" onclick="downloadFile('${file}')">⬇ DOWNLOAD</button>
                <button class="delete-btn" onclick="deleteFile('${file}')">✖</button>
            `;
            fileListDiv.appendChild(fileItem);
        });
    } catch (error) {
        console.error('Error loading files:', error);
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ ERROR: Failed to load files' + error.message;
    }
}

async function downloadFile(filename) {
    const a = document.createElement('a');
    a.href = `/download/${filename}`;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

async function deleteFile(filename) {
    const statusDiv = document.getElementById('uploadStatus');
    try {
        const response = await fetch(`/delete/${filename}`, {method: 'DELETE'});
        if (response.ok) {
            statusDiv.className = 'status success';
            statusDiv.textContent = '✓ SUCCESS: File deleted!';
            loadFiles();
        } else if (response.status === 404) {
            throw new Error('Delete failed, file not found');
        } else {
            throw new Error('Delete failed')
        }
    } catch (error) {
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ ERROR: ' + error.message;
    }
}