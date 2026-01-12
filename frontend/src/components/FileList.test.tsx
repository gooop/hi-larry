import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileList from './FileList';

describe('FileList', () => {
  it('renders empty state when no files', () => {
    render(<FileList files={[]} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText('No files available')).toBeInTheDocument();
  });

  it('renders list of files', () => {
    const files = ['file1.txt', 'file2.pdf', 'image.png'];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    expect(screen.getByText(/file1\.txt/)).toBeInTheDocument();
    expect(screen.getByText(/file2\.pdf/)).toBeInTheDocument();
    expect(screen.getByText(/image\.png/)).toBeInTheDocument();
  });

  it('calls onDownload when download button is clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    const files = ['test.txt'];

    render(<FileList files={files} onDownload={onDownload} onDelete={() => {}} />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await user.click(downloadButton);

    expect(onDownload).toHaveBeenCalledWith('test.txt');
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const files = ['test.txt'];

    render(<FileList files={files} onDownload={() => {}} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('test.txt');
  });

  it('renders download and delete buttons for each file', () => {
    const files = ['file1.txt', 'file2.txt'];

    render(<FileList files={files} onDownload={() => {}} onDelete={() => {}} />);

    const downloadButtons = screen.getAllByRole('button', { name: /download/i });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(downloadButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});
