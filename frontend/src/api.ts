export type FileInfo = Record<string, string[]>;

export async function listFiles(): Promise<FileInfo[]> {
  const response = await fetch('/list');
  if (!response.ok) {
    throw new Error('Failed to load files');
  }
  return response.json();
}

export async function deleteFile(filename: string): Promise<void> {
  const response = await fetch(`/delete/${filename}`, { method: 'DELETE' });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('File not found');
    }
    throw new Error('Delete failed');
  }
}

export function uploadFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = (e.loaded / e.total) * 100;
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve();
      } else {
        reject(new Error('Upload failed'));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', '/upload');
    xhr.send(formData);
  });
}

export function downloadFile(filename: string): void {
  window.location.href = `/download/${filename}`;
}
