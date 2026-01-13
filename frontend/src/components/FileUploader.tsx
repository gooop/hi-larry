import { useState, useRef, useEffect } from 'react';
import { uploadFile } from '../api';

interface FileUploaderProps {
  onUploadComplete: () => void;
  externalStatus?: { type: 'success' | 'error'; message: string } | null;
  onClearExternalStatus?: () => void;
}

type Status = 'idle' | 'uploading' | 'success' | 'error';

export default function FileUploader({
  onUploadComplete,
  externalStatus,
  onClearExternalStatus
}: FileUploaderProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const timer = setTimeout(() => {
        setShowProgress(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleUpload = async () => {
    onClearExternalStatus?.();

    const fileInput = fileInputRef.current;
    if (!fileInput?.files?.length) {
      setStatus('error');
      setErrorMessage('Please select a file');
      return;
    }

    const file = fileInput.files[0];
    setStatus('uploading');
    setProgress(0);
    setShowProgress(true);
    setErrorMessage('');

    try {
      await uploadFile(file, (percent) => {
        setProgress(Math.round(percent));
      });
      setStatus('success');
      fileInput.value = '';
      onUploadComplete();
    } catch {
      setStatus('error');
      setErrorMessage('Upload failed');
    }
  };

  const showExternalStatus = status === 'idle' && externalStatus;

  return (
    <div>
      <input type="file" ref={fileInputRef} />
      <button className="button button-primary upload-button" onClick={handleUpload}>
        UPLOAD
      </button>

      {showProgress && (
        <div className="progress-bar" style={{ display: 'block' }}>
          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
      )}

      {status === 'success' && (
        <div className="status success">✓ SUCCESS: File uploaded!</div>
      )}

      {status === 'error' && errorMessage && (
        <div className="status error">⚠ ERROR: {errorMessage}</div>
      )}

      {showExternalStatus && (
        <div className={`status ${externalStatus.type}`}>
          {externalStatus.message}
        </div>
      )}
    </div>
  );
}
