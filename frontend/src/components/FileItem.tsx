import { useState } from 'react';
import Dropdown from './Dropdown.tsx';
import Input from './Input.tsx';

import { FileMetadata } from '../api.ts';
import TypeIcon from './TypeIcon.tsx';

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
  const [titleInputValue, setTitleInputValue] = useState('');
  const [authorInputValue, setAuthorInputValue] = useState('');
  const [typeInputValue, setTypeInputValue] = useState(type ?? '');

  const handleSelectionChange = (selected: boolean) => {
    if (!selected) {
      setTitleInputValue('');
      setAuthorInputValue('');
      setTypeInputValue('');
    }
    setIsSelected(selected);
  };
  const titleHasBeenChanged =
    titleInputValue !== title && titleInputValue !== '';
  const authorHasBeenChanged =
    authorInputValue !== author && authorInputValue !== '';
  const typeHasBeenChanged = typeInputValue !== type && typeInputValue !== '';
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
          <TypeIcon type={type}></TypeIcon>
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
          placeholder={title}
          value={titleInputValue}
          setFn={setTitleInputValue}
        />
        <Input
          label={'Author'}
          placeholder={author ?? ''}
          value={authorInputValue}
          setFn={setAuthorInputValue}
        />
        <Dropdown
          label={'Type'}
          value={typeInputValue}
          setFn={setTypeInputValue}
        />
        <button
          className="button button-icon button-primary"
          onClick={() =>
            onEditMetadata({
              filename,
              title: titleHasBeenChanged ? titleInputValue : undefined,
              author: authorHasBeenChanged ? authorInputValue : undefined,
              type: typeHasBeenChanged ? typeInputValue : undefined,
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
