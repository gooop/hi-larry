interface FileListProps {
  files: string[];
  onDownload: (filename: string) => void;
  onDelete: (filename: string) => void;
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
      {files.map((file) => (
        <div key={file} className="file-item">
          <span>► {file}</span>
          <div className="file-buttons-group">
            <button
              className="button download-button"
              onClick={() => onDownload(file)}
            >
              ⬇ DOWNLOAD
            </button>
            <button
              className="delete-button"
              onClick={() => onDelete(file)}
              aria-label="delete"
            >
              ✖
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
