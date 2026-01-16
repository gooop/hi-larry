import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TitleModalProps {
  filename: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (filename: string, title: string) => void;
}

export default function TitleModal({
  filename,
  isOpen,
  onClose,
  onSubmit,
}: TitleModalProps) {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle) {
      onSubmit(filename, trimmedTitle);
    }
  }

  function closeOnBackdropClick(event: React.MouseEvent) {
    const clickedOnBackdrop = event.target === event.currentTarget;
    if (clickedOnBackdrop) {
      onClose();
    }
  }

  return createPortal(
    <div
      role="dialog"
      className="modal-backdrop"
      data-testid="modal-backdrop"
      onClick={closeOnBackdropClick}
    >
      <div className="modal-content">
        <h3 className="modal-title">Edit File Metadata</h3>
        <p className="modal-filename">{filename}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            autoFocus
          />
          <div className="modal-buttons">
            <button
              type="button"
              className="button button-neutral modal-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary modal-button"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
