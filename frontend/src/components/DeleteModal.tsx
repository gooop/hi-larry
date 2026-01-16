import { useEffect } from 'react';

interface DeleteModalProps {
  filename: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (filename: string) => void;
}

export default function DeleteModal({
  filename,
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  useEffect(() => {
    if (!isOpen) {
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
    onConfirm(filename);
  }

  function closeOnBackdropClick(event: React.MouseEvent) {
    const clickedOnBackdrop = event.target === event.currentTarget;
    if (clickedOnBackdrop) {
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      className="modal-backdrop"
      data-testid="modal-backdrop"
      onClick={closeOnBackdropClick}
    >
      <div className="modal-content">
        <p className="modal-filename">{filename}</p>
        <form onSubmit={handleSubmit}>
          <div className="modal-buttons">
            <button
              type="button"
              className="button button-neutral modal-button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="button button-danger modal-button">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
