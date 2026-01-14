import { useState, useEffect } from 'react';
import { listFiles, deleteFile, downloadFile, type FileInfo } from './api';
import FileList from './components/FileList';
import FileUploader from './components/FileUploader';
import './colors.css';
import './styles.css';

type StatusType = 'idle' | 'success' | 'error';

export default function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [deleteStatus, setDeleteStatus] = useState<StatusType>('idle');
  const [deleteMessage, setDeleteMessage] = useState('');

  const loadFileList = async () => {
    try {
      const fileInfoList = await listFiles();
      setFiles(fileInfoList);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  useEffect(() => {
    loadFileList();
  }, []);

  const handleDelete = async (filename: string) => {
    try {
      await deleteFile(filename);
      setDeleteStatus('success');
      setDeleteMessage('✓ SUCCESS: File deleted!');
      loadFileList();
    } catch (error) {
      setDeleteStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Delete failed';
      setDeleteMessage(`⚠ ERROR: ${errorMsg}`);
    }
  };

  const handleUploadComplete = () => {
    setDeleteStatus('idle');
    setDeleteMessage('');
    loadFileList();
  };

  const handleClearDeleteStatus = () => {
    setDeleteStatus('idle');
    setDeleteMessage('');
  };

  return (
    <>
      <div className="tv-frame" />
      <div className="scanlines" />
      <div className="scrollable-content">
        <h1>Hi, Larry</h1>
        <div className="file-container">
          <div className="section upload-section">
            <h2>UPLOAD FILE</h2>
            <FileUploader
              onUploadComplete={handleUploadComplete}
              externalStatus={
                deleteStatus !== 'idle'
                  ? {
                      type: deleteStatus,
                      message: deleteMessage,
                    }
                  : null
              }
              onClearExternalStatus={handleClearDeleteStatus}
            />
          </div>
          <div className="section file-list-section">
            <h2>FILE LIST</h2>
            <div id="fileList">
              <FileList
                files={files}
                onDownload={downloadFile}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
