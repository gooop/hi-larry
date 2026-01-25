import { useState } from 'react';
import Input from './Input.tsx';

import { FileMetadata } from '../api.ts';

interface FileItemProps {
  fileMetadata: FileMetadata;
  onDownload: (filename: string) => void;
  onEditMetadata: ({ filename, title, author, type }: FileMetadata) => void;
  openDeleteModal: (filename: string) => void;
}

export default function FileItem({
  fileMetadata,
  openDeleteModal,
  onEditMetadata,
  onDownload,
}: FileItemProps) {
  const { filename, title: customTitle, author, type } = fileMetadata;
  const title = customTitle === '' ? filename : (customTitle ?? filename);
  const [isSelected, setIsSelected] = useState(false);
  const [titleInputContents, setTitleInputContents] = useState(title);
  const [authorInputContents, setAuthorInputContents] = useState(author ?? '');
  const [typeInputContents, setTypeInputContents] = useState(type ?? '');

  const handleSelectionChange = (selected: boolean) => {
    if (!selected) {
      setTitleInputContents(title);
      setAuthorInputContents(author ?? '');
      setTypeInputContents(type ?? '');
    }
    setIsSelected(selected);
  };
  const titleHasBeenChanged =
    titleInputContents !== title && titleInputContents !== '';
  const authorHasBeenChanged =
    authorInputContents !== author && authorInputContents !== '';
  const typeHasBeenChanged =
    typeInputContents !== type && typeInputContents !== '';
  const isSaveEnabled =
    titleHasBeenChanged || authorHasBeenChanged || typeHasBeenChanged;

  return (
    <div className="file-item">
      <article
        className={
          isSelected ? 'file-item-header selected' : 'file-item-header'
        }
      >
        <label>
          <input
            type="checkbox"
            value={filename}
            checked={isSelected}
            onChange={(e) => handleSelectionChange(e.target.checked)}
          />
          <span>{isSelected ? `▼ ${title}` : `► ${title}`}</span>
          <p className="file-item-author-text">
            {author == null ? undefined : `by: ${author}`}
          </p>
        </label>
        <div className="file-buttons-group">
          <button
            type="button"
            className="button button-primary"
            onClick={() => onDownload(filename)}
          >
            ⬇ DOWNLOAD
          </button>
          <button
            type="button"
            className="button button-icon button-danger"
            onClick={() => openDeleteModal(filename)}
            aria-label="Delete file"
          >
            ✖
          </button>
        </div>
      </article>
      <article
        className={
          isSelected ? 'file-item-dropdown expanded' : 'file-item-dropdown'
        }
      >
        <p>{`File Name: ${filename}`}</p>
        <Input
          label={'Title'}
          placeholder={titleInputContents}
          setFn={setTitleInputContents}
        />
        <Input
          label={'Author'}
          placeholder={authorInputContents}
          setFn={setAuthorInputContents}
        />
        <Input
          label={'Type'}
          placeholder={typeInputContents}
          setFn={setTypeInputContents}
        />
        <button
          className="button button-icon button-primary"
          onClick={() =>
            onEditMetadata({
              filename,
              title: titleHasBeenChanged ? titleInputContents : undefined,
              author: authorHasBeenChanged ? authorInputContents : undefined,
              type: typeHasBeenChanged ? typeInputContents : undefined,
            })
          }
          aria-label="Save file metadata"
          disabled={!isSaveEnabled}
          type="button"
        >
          Save
        </button>
      </article>
    </div>
  );
}
