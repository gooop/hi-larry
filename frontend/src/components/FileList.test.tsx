import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileList from './FileList';
import { FileMetadata } from '../api.ts';

describe('FileList', () => {
  it('renders empty state when no files', () => {
    render(
      <FileList
        files={[]}
        onDownload={() => {}}
        onDelete={() => {}}
        onEditMetadata={() => {}}
      />
    );

    expect(screen.getByText('No files available')).toBeInTheDocument();
  });

  it('renders list of files showing filenames when no title set', () => {
    const files: FileMetadata[] = [
      { filename: 'file1.txt' },
      { filename: 'file2.pdf', title: '' },
      { filename: 'image.png', title: 'My Awesome Document' },
    ];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={() => {}}
        onEditMetadata={() => {}}
      />
    );

    expect(screen.getByText('► file1.txt')).toBeInTheDocument();
    expect(screen.getByText('► file2.pdf')).toBeInTheDocument();
    expect(screen.queryByText('► image.png')).not.toBeInTheDocument();
    expect(screen.getByText(/My Awesome Document/)).toBeInTheDocument();
  });

  it('calls onDownload with actual filename even when title is displayed', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    const files: FileMetadata[] = [
      { filename: 'actual-file.txt', title: 'Display Title' },
    ];

    render(
      <FileList
        files={files}
        onDownload={onDownload}
        onDelete={() => {}}
        onEditMetadata={() => {}}
      />
    );

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await user.click(downloadButton);

    expect(onDownload).toHaveBeenCalledWith('actual-file.txt');
  });

  it('opens a modal when the delete button is pressed', async () => {
    const user = userEvent.setup();
    const files: FileMetadata[] = [{ filename: 'actual-file.txt' }];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={() => {}}
        onEditMetadata={() => {}}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('only calls onDelete when the modal is confirmed', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const files: FileMetadata[] = [{ filename: 'actual-file.txt' }];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={onDelete}
        onEditMetadata={() => {}}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    let cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    await user.click(cancelButton);
    expect(onDelete).not.toHaveBeenCalled();

    await user.click(deleteButton);
    let confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeInTheDocument();
    await user.click(confirmButton);
    expect(onDelete).toHaveBeenCalled();
  });

  it('closes when the modal is cancelled', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const files: FileMetadata[] = [{ filename: 'actual-file.txt' }];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={onDelete}
        onEditMetadata={() => {}}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    let cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    await user.click(cancelButton);
    expect(onDelete).not.toHaveBeenCalled();

    expect(await screen.queryByRole('button', { name: /confirm/i })).toBeNull();
    expect(await screen.queryByRole('button', { name: /cancel/i })).toBeNull();
  });

  it('calls onDelete with actual filename even when title is displayed', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const files: FileMetadata[] = [
      { filename: 'actual-file.txt', title: 'Display Title' },
    ];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={onDelete}
        onEditMetadata={() => {}}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    let confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeInTheDocument();
    await user.click(confirmButton);
    expect(onDelete).toHaveBeenCalled();

    expect(onDelete).toHaveBeenCalledWith('actual-file.txt');
  });

  it('renders files sorted alphabetically by title, falling back to filename', () => {
    const files: FileMetadata[] = [
      { filename: 'zebra.txt' },
      { filename: 'apple.pdf', title: 'Banana Book' },
      { filename: 'berry.txt', title: '' },
      { filename: 'aardvark.txt', title: '' },
      { filename: 'mango.doc', title: 'Alpha Guide' },
      { filename: 'donut.txt', title: '' },
      { filename: 'cherry.txt', title: '' },
    ];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={() => {}}
        onEditMetadata={() => {}}
      />
    );

    const items = screen.getAllByText(/^[►▼]/).map((el) => el.textContent);
    expect(items).toEqual([
      '► aardvark.txt',
      '► Alpha Guide',
      '► Banana Book',
      '► berry.txt',
      '► cherry.txt',
      '► donut.txt',
      '► zebra.txt',
    ]);
  });

  it('renders download and delete buttons for each file', () => {
    const files: FileMetadata[] = [
      { filename: 'file1.txt', title: 'Title 1' },
      { filename: 'file2.txt' },
    ];

    render(
      <FileList
        files={files}
        onDownload={() => {}}
        onDelete={() => {}}
        onEditMetadata={() => {}}
      />
    );

    const downloadButtons = screen.getAllByRole('button', {
      name: /download/i,
    });
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

    expect(downloadButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });
});
