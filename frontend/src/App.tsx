import { useState, useEffect } from 'react';
import { listFiles, deleteFile, downloadFile, editFileMetadata, type FileInfo } from './api';
import FileList from './components/FileList';
import FileUploader from './components/FileUploader';
import GitHubLink from './components/GitHubLink';
import './colors.css';
import './styles.css';

type StatusType = 'idle' | 'success' | 'error';

export default function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [operationStatus, setOperationStatus] = useState<StatusType>('idle');
  const [operationMessage, setOperationMessage] = useState('');

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
      setOperationStatus('success');
      setOperationMessage('✓ SUCCESS: File deleted!');
      loadFileList();
    } catch (error) {
      setOperationStatus('error');
      const errorMsg = error instanceof Error ? error.message : 'Delete failed';
      setOperationMessage(`⚠ ERROR: ${errorMsg}`);
    }
  };

  const handleUploadComplete = () => {
    setOperationStatus('idle');
    setOperationMessage('');
    loadFileList();
  };

  const handleClearStatus = () => {
    setOperationStatus('idle');
    setOperationMessage('');
  };

  const handleEditMetadata = async (filename: string, title: string) => {
    try {
      await editFileMetadata(filename, title);
      loadFileList();
    } catch (error) {
      setOperationStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Failed to edit metadata';
      setOperationMessage(`⚠ ERROR: ${errorMessage}`);
    }
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
                operationStatus !== 'idle'
                  ? {
                      type: operationStatus,
                      message: operationMessage,
                    }
                  : null
              }
              onClearExternalStatus={handleClearStatus}
            />
          </div>
          <div className="section file-list-section">
            <h2>FILE LIST</h2>
            <div id="fileList">
              <FileList
                files={files}
                onDownload={downloadFile}
                onDelete={handleDelete}
                onEditMetadata={handleEditMetadata}
              />
            </div>
          </div>
        </div>
        <footer className="github-footer">
          <GitHubLink />
        </footer>
      </div>
    </>
  );
}
