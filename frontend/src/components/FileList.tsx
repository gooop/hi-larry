import { useMemo, useState } from 'react';
import type { FileMetadata } from '../api';
import DeleteModal from './DeleteModal.tsx';
import FileItem from './FileItem.tsx';

interface FileListProps {
  files: FileMetadata[];
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
  onEditMetadata: ({ filename, title, author, type }: FileMetadata) => void;
}

export default function FileList({
  files,
  onDownload,
  onDelete,
  onEditMetadata,
}: FileListProps) {
  const [fileSelectedForDelete, setFileSelectedForDelete] = useState<
    string | null
  >(null);

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

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      const aSort = a.title || a.filename;
      const bSort = b.title || b.filename;
      return aSort.localeCompare(bSort);
    });
  }, [files]);

  if (files.length === 0) {
    return (
      <div style={{ padding: '15px', textAlign: 'center', opacity: 0.6 }}>
        No files available
      </div>
    );
  }

  return (
    <form>
      {sortedFiles.map((file) => {
        return (
          <FileItem
            fileMetadata={file}
            onDownload={onDownload}
            onEditMetadata={onEditMetadata}
            openDeleteModal={openDeleteModal}
            key={file.filename}
          />
        );
      })}
      <DeleteModal
        filename={fileSelectedForDelete || ''}
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteSubmit}
      />
    </form>
  );
}
