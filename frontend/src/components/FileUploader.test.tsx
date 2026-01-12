import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FileUploader from './FileUploader';
import * as api from '../api';

// Mock the API module
vi.mock('../api', () => ({
  uploadFile: vi.fn(),
}));

describe('FileUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders file input and upload button', () => {
    render(<FileUploader onUploadComplete={() => {}} />);

    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
    // File input might not have a role, check by type
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('shows error when uploading with no file selected', async () => {
    const user = userEvent.setup();
    render(<FileUploader onUploadComplete={() => {}} />);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    expect(screen.getByText(/please select a file/i)).toBeInTheDocument();
  });

  it('uploads file and calls onUploadComplete on success', async () => {
    const user = userEvent.setup();
    const onUploadComplete = vi.fn();
    vi.mocked(api.uploadFile).mockResolvedValue(undefined);

    render(<FileUploader onUploadComplete={onUploadComplete} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalled();
    });

    expect(api.uploadFile).toHaveBeenCalled();
  });

  it('shows success message after upload', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadFile).mockResolvedValue(undefined);

    render(<FileUploader onUploadComplete={() => {}} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/file uploaded/i)).toBeInTheDocument();
    });
  });

  it('shows error message when upload fails', async () => {
    const user = userEvent.setup();
    vi.mocked(api.uploadFile).mockRejectedValue(new Error('Upload failed'));

    render(<FileUploader onUploadComplete={() => {}} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  it('shows progress bar during upload', async () => {
    const user = userEvent.setup();
    // Mock uploadFile to capture the onProgress callback
    let capturedOnProgress: ((percent: number) => void) | undefined;
    vi.mocked(api.uploadFile).mockImplementation((_file, onProgress) => {
      capturedOnProgress = onProgress;
      return new Promise(() => {}); // Never resolves during test
    });

    render(<FileUploader onUploadComplete={() => {}} />);

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    await user.upload(input, file);

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    // Simulate progress wrapped in act
    await act(async () => {
      if (capturedOnProgress) {
        capturedOnProgress(50);
      }
    });

    await waitFor(() => {
      expect(screen.getByText('50%')).toBeInTheDocument();
    });
  });
});
