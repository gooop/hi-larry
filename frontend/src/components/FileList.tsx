import type { FileInfo } from '../api';

interface FileListProps {
  files: FileInfo[];
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
}

function getDisplayName(fileInfo: FileInfo): { filename: string; displayName: string } {
  const filename = Object.keys(fileInfo)[0];
  const xattrTitles = fileInfo[filename];
  const firstTitle = xattrTitles[0]?.trim();
  const displayName = firstTitle || filename;
  return { filename, displayName };
}

export default function FileList({ files, onDownload, onDelete }: FileListProps) {
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
        const { filename, displayName } = getDisplayName(fileInfo);

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
                aria-label="..."
              >
                ...
              </button>
              <button
                className="button button-icon button-danger"
                onClick={() => onDelete(filename)}
                aria-label="delete"
              >
                ✖
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
