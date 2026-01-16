import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as api from './api';

// Mock the API module
vi.mock('./api', () => ({
  listFiles: vi.fn(),
  deleteFile: vi.fn(),
  downloadFile: vi.fn(),
  uploadFile: vi.fn(),
  editFileMetadata: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for listFiles returns empty array
    vi.mocked(api.listFiles).mockResolvedValue([]);
  });

  it('renders the app title', async () => {
    render(<App />);

    expect(screen.getByText('Hi, Larry')).toBeInTheDocument();

    // Wait for any pending state updates
    await waitFor(() => {
      expect(api.listFiles).toHaveBeenCalled();
    });
  });

  it('loads and displays files on mount', async () => {
    vi.mocked(api.listFiles).mockResolvedValue([
      { 'file1.txt': [] },
      { 'file2.pdf': [] },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/file1\.txt/)).toBeInTheDocument();
      expect(screen.getByText(/file2\.pdf/)).toBeInTheDocument();
    });

    expect(api.listFiles).toHaveBeenCalled();
  });

  it('shows empty state when no files', async () => {
    vi.mocked(api.listFiles).mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No files available')).toBeInTheDocument();
    });
  });

  it('deletes file and refreshes list', async () => {
    const user = userEvent.setup();
    vi.mocked(api.listFiles)
      .mockResolvedValueOnce([{ 'test.txt': [] }])
      .mockResolvedValueOnce([]);
    vi.mocked(api.deleteFile).mockResolvedValue(undefined);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/test\.txt/)).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    let confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toBeInTheDocument();
    await user.click(confirmButton);

    await waitFor(() => {
      expect(api.deleteFile).toHaveBeenCalledWith('test.txt');
    });

    // List should be refreshed
    expect(api.listFiles).toHaveBeenCalledTimes(2);
  });

  it('downloads file when download button clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(api.listFiles).mockResolvedValue([{ 'test.txt': [] }]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/test\.txt/)).toBeInTheDocument();
    });

    const downloadButton = screen.getByRole('button', {
      name: /download/i,
    });
    await user.click(downloadButton);

    expect(api.downloadFile).toHaveBeenCalledWith('test.txt');
  });

  it('edits file metadata when modal is submitted', async () => {
    const user = userEvent.setup();
    vi.mocked(api.listFiles).mockResolvedValue([{ 'document.txt': [] }]);
    vi.mocked(api.editFileMetadata).mockResolvedValue(undefined);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/document\.txt/)).toBeInTheDocument();
    });

    // Click the "..." button to open modal
    const moreButton = screen.getByRole('button', { name: /edit title/i });
    await user.click(moreButton);

    // Type a title
    const input = screen.getByPlaceholderText('Title');
    await user.type(input, 'My Document Title');

    // Submit the form
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(api.editFileMetadata).toHaveBeenCalledWith(
        'document.txt',
        'My Document Title'
      );
    });

    // List should be refreshed after metadata update
    expect(api.listFiles).toHaveBeenCalledTimes(2);
  });

  it('displays error message when metadata edit fails', async () => {
    const user = userEvent.setup();
    vi.mocked(api.listFiles).mockResolvedValue([{ 'document.txt': [] }]);
    vi.mocked(api.editFileMetadata).mockRejectedValue(
      new Error('Network error')
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/document\.txt/)).toBeInTheDocument();
    });

    // Click the "..." button to open modal
    const moreButton = screen.getByRole('button', { name: /edit title/i });
    await user.click(moreButton);

    // Type a title
    const input = screen.getByPlaceholderText('Title');
    await user.type(input, 'My Title');

    // Submit the form
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText(/ERROR: Network error/)).toBeInTheDocument();
    });
  });
});
