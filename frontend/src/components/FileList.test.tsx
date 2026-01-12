import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileList from './FileList';
import type { FileInfo } from '../api';

describe('FileList', () => {
  it('renders empty state when no files', () => {
    render(<FileList files={[]} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('No files available')).toBeInTheDocument();
  });

  it('renders list of files showing filenames when no title set', () => {
    const files: FileInfo[] = [
      { 'file1.txt': [] },
      { 'file2.pdf': [] },
      { 'image.png': [] },
    ];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText(/file1\.txt/)).toBeInTheDocument();
    expect(screen.getByText(/file2\.pdf/)).toBeInTheDocument();
    expect(screen.getByText(/image\.png/)).toBeInTheDocument();
  });

  it('displays xattr title instead of filename when title is set', () => {
    const files: FileInfo[] = [
      { 'boring-filename.txt': ['My Awesome Document'] },
    ];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText(/My Awesome Document/)).toBeInTheDocument();
    expect(screen.queryByText(/boring-filename\.txt/)).not.toBeInTheDocument();
  });

  it('falls back to filename when title is empty string', () => {
    const files: FileInfo[] = [
      { 'actual-file.txt': [''] },
    ];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText(/actual-file\.txt/)).toBeInTheDocument();
  });

  it('falls back to filename when title is whitespace only', () => {
    const files: FileInfo[] = [
      { 'actual-file.txt': ['   '] },
    ];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText(/actual-file\.txt/)).toBeInTheDocument();
  });

  it('calls onDownload with actual filename even when title is displayed', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    const files: FileInfo[] = [
      { 'actual-file.txt': ['Display Title'] },
    ];

    render(<FileList files={files} onDownload={onDownload} onDelete={() => {}} />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await user.click(downloadButton);

    expect(onDownload).toHaveBeenCalledWith('actual-file.txt');
  });

  it('calls onDelete with actual filename even when title is displayed', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const files: FileInfo[] = [
      { 'actual-file.txt': ['Display Title'] },
    ];

    render(<FileList files={files} onDownload={() => {}} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('actual-file.txt');
  });

  it('renders download and delete buttons for each file', () => {
    const files: FileInfo[] = [
      { 'file1.txt': ['Title 1'] },
      { 'file2.txt': [] },
    ];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    const downloadButtons = screen.getAllByRole('button', { name: /download/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(downloadButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});
