import { useState } from 'react';
import type { FileInfo } from '../api';
import TitleModal from './TitleModal';
import DeleteModal from './DeleteModal.tsx';

interface FileListProps {
  files: FileInfo[];
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  onEditMetadata?: (filename: string, title: string) => void;
}

function extractFileDetails(fileInfo: FileInfo): {
  filename: string;
  displayName: string;
} {
  const filename = Object.keys(fileInfo)[0];
  const metadataTitles = fileInfo[filename];
  const customTitle = metadataTitles[0]?.trim();
  const displayName = customTitle || filename;
  return { filename, displayName };
}

export default function FileList({
  files,
  onDownload,
  onDelete,
  onEditMetadata,
}: FileListProps) {
  const [fileSelectedForEdit, setFileSelectedForEdit] = useState<string | null>(
    null
  );
  const [fileSelectedForDelete, setFileSelectedForDelete] = useState<
    string | null
  >(null);
  const isTitleModalOpen = fileSelectedForEdit !== null;
  function openTitleModal(filename: string) {
    setFileSelectedForEdit(filename);
  }

  function closeTitleModal() {
    setFileSelectedForEdit(null);
  }

  function handleTitleSubmit(filename: string, title: string) {
    onEditMetadata?.(filename, title);
    closeTitleModal();
  }

  const isDeleteModalOpen = fileSelectedForDelete !== null;
  function openDeleteModal(filename: string) {
    setFileSelectedForDelete(filename);
  }

  function closeDeleteModal() {
    setFileSelectedForDelete(null);
  }

  function handleDeleteSubmit(filename: string) {
    onDelete(filename);
    closeDeleteModal();
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
                onClick={() => openDeleteModal(filename)}
                aria-label="Delete file"
              >
                ✖
              </button>
            </div>
          </div>
        );
      })}
      <TitleModal
        filename={fileSelectedForEdit || ''}
        isOpen={isTitleModalOpen}
        onClose={closeTitleModal}
        onSubmit={handleTitleSubmit}
      />
      <DeleteModal
        filename={fileSelectedForDelete || ''}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSubmit}
      />
    </div>
  );
}
