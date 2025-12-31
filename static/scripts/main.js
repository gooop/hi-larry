// Load file list on page load
loadFiles();

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const statusDiv = document.getElementById('uploadStatus');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (!fileInput.files.length) {
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ ERROR: Please select a file';
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Show progress bar
    progressBar.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    statusDiv.textContent = '';

    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            progressFill.style.width = percentComplete + '%';
            progressText.textContent = Math.round(percentComplete) + '%';
        }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            statusDiv.className = 'status success';
            statusDiv.textContent = '✓ SUCCESS: File uploaded!';
            fileInput.value = '';
            loadFiles();
        } else {
            statusDiv.className = 'status error';
            statusDiv.textContent = '⚠ ERROR: Upload failed';
        }
        // Hide progress bar after a delay
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 1000);
    });

    // Handle errors
    xhr.addEventListener('error', () => {
        statusDiv.className = 'status error';
        statusDiv.textContent = '⚠ ERROR: Upload failed';
        progressBar.style.display = 'none';
    });

    xhr.open('POST', '/upload');
    xhr.send(formData);
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
                <div class="file-buttons-group">
                    <button class="button download-button" onclick="downloadFile('${file}')">⬇ DOWNLOAD</button>
                    <button class="delete-button" onclick="deleteFile('${file}')">✖</button>
                </div>
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
    window.location.href = `/download/${filename}`
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