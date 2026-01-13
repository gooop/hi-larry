import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { listFiles, deleteFile, uploadFile, editFileMetadata } from './api';

describe('API functions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('listFiles', () => {
    it('should fetch files from /list endpoint', async () => {
      const mockFiles = [{ 'file1.txt': [] }, { 'file2.pdf': [] }];
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: () => Promise.resolve(mockFiles),
        })
      );

      const result = await listFiles();

      expect(fetch).toHaveBeenCalledWith('/list');
      expect(result).toEqual(mockFiles);
    });

    it('should throw error when fetch fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      await expect(listFiles()).rejects.toThrow('Failed to load files');
    });
  });

  describe('deleteFile', () => {
    it('should send DELETE request to /delete/{filename}', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
        })
      );

      await deleteFile('test.txt');

      expect(fetch).toHaveBeenCalledWith('/delete/test.txt', {
        method: 'DELETE',
      });
    });

    it('should throw error when file not found', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        })
      );

      await expect(deleteFile('missing.txt')).rejects.toThrow('File not found');
    });

    it('should throw error when delete fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      await expect(deleteFile('test.txt')).rejects.toThrow('Delete failed');
    });
  });

  describe('uploadFile', () => {
    it('should upload file to /upload endpoint', async () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });

      // Mock XMLHttpRequest as a class
      const openMock = vi.fn();
      const sendMock = vi.fn();
      const uploadAddEventListenerMock = vi.fn();
      const addEventListenerMock = vi.fn();

      class MockXHR {
        status = 200;
        open = openMock;
        send = sendMock;
        upload = { addEventListener: uploadAddEventListenerMock };
        addEventListener = addEventListenerMock;
      }

      vi.stubGlobal(
        'XMLHttpRequest',
        MockXHR as unknown as typeof XMLHttpRequest
      );

      const uploadPromise = uploadFile(mockFile);

      // Simulate successful upload
      const loadHandler = addEventListenerMock.mock.calls.find(
        (call: unknown[]) => call[0] === 'load'
      )?.[1];
      if (loadHandler) loadHandler();

      await expect(uploadPromise).resolves.toBeUndefined();
      expect(openMock).toHaveBeenCalledWith('POST', '/upload');
      expect(sendMock).toHaveBeenCalled();
    });

    it('should call onProgress callback during upload', async () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const onProgress = vi.fn();

      const openMock = vi.fn();
      const sendMock = vi.fn();
      const uploadAddEventListenerMock = vi.fn();
      const addEventListenerMock = vi.fn();

      class MockXHR {
        status = 200;
        open = openMock;
        send = sendMock;
        upload = { addEventListener: uploadAddEventListenerMock };
        addEventListener = addEventListenerMock;
      }

      vi.stubGlobal(
        'XMLHttpRequest',
        MockXHR as unknown as typeof XMLHttpRequest
      );

      const uploadPromise = uploadFile(mockFile, onProgress);

      // Simulate progress event
      const progressHandler = uploadAddEventListenerMock.mock.calls.find(
        (call: unknown[]) => call[0] === 'progress'
      )?.[1];
      if (progressHandler) {
        progressHandler({
          lengthComputable: true,
          loaded: 50,
          total: 100,
        });
      }

      // Simulate successful upload
      const loadHandler = addEventListenerMock.mock.calls.find(
        (call: unknown[]) => call[0] === 'load'
      )?.[1];
      if (loadHandler) loadHandler();

      await uploadPromise;
      expect(onProgress).toHaveBeenCalledWith(50);
    });
  });

  describe('editFileMetadata', () => {
    it('should post file metadata as {filename: title} to /metadata endpoint', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
        })
      );

      await editFileMetadata('myfile.txt', 'My Document Title');

      expect(fetch).toHaveBeenCalledWith('/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'myfile.txt': 'My Document Title',
        }),
      });
    });

    it('should throw error when file not found', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
        })
      );

      await expect(editFileMetadata('missing.txt', 'Title')).rejects.toThrow(
        'File not found'
      );
    });

    it('should throw error when edit fails', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
        })
      );

      await expect(editFileMetadata('test.txt', 'Title')).rejects.toThrow(
        'Failed to update file metadata'
      );
    });
  });
});
