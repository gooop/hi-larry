import { useState } from 'react';
import type { FileInfo } from '../api';
import TitleModal from './TitleModal';

interface FileListProps {
  files: FileInfo[];
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  onEditMetadata?: (filename: string, title: string) => void;
}

function extractFileDetails(fileInfo: FileInfo): { filename: string; displayName: string } {
  const filename = Object.keys(fileInfo)[0];
  const metadataTitles = fileInfo[filename];
  const customTitle = metadataTitles[0]?.trim();
  const displayName = customTitle || filename;
  return { filename, displayName };
}

export default function FileList({ files, onDownload, onDelete, onEditMetadata }: FileListProps) {
  const [fileSelectedForTitleEdit, setFileSelectedForTitleEdit] = useState<string | null>(null);
  const isModalOpen = fileSelectedForTitleEdit !== null;

  function openTitleModal(filename: string) {
    setFileSelectedForTitleEdit(filename);
  }

  function closeTitleModal() {
    setFileSelectedForTitleEdit(null);
  }

  function handleTitleSubmit(filename: string, title: string) {
    onEditMetadata?.(filename, title);
    closeTitleModal();
  }

  if (files.length === 0) {
    return (
      <div style={{ padding: '15px', textAlign: 'center', opacity: 0.6 }}>
        No files available
      </div>
    );
  }

  return (
    <div>
      {files.map((fileInfo) => {
        const { filename, displayName } = extractFileDetails(fileInfo);

        return (
          <div key={filename} className="file-item">
            <span>► {displayName}</span>
            <div className="file-buttons-group">
              <button
                className="button button-primary button-small"
                onClick={() => onDownload(filename)}
              >
                ⬇ DOWNLOAD
              </button>
              <button
                className="button button-icon button-neutral"
                aria-label="Edit title"
                onClick={() => openTitleModal(filename)}
              >
                ...
              </button>
              <button
                className="button button-icon button-danger"
                onClick={() => onDelete(filename)}
                aria-label="Delete file"
              >
                ✖
              </button>
            </div>
          </div>
        );
      })}
      <TitleModal
        filename={fileSelectedForTitleEdit || ''}
        isOpen={isModalOpen}
        onClose={closeTitleModal}
        onSubmit={handleTitleSubmit}
      />
    </div>
  );
}
