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
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock for listFiles returns empty array
    vi.mocked(api.listFiles).mockResolvedValue([]);
  });

  it('renders the app title', async () => {
    render(<App />);

    expect(screen.getByText('HI-LARRY')).toBeInTheDocument();

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

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await user.click(downloadButton);

    expect(api.downloadFile).toHaveBeenCalledWith('test.txt');
  });
});
