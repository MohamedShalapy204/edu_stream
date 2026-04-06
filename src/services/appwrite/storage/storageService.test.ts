import { describe, it, expect, vi, beforeEach } from 'vitest';
import { storageService } from './storageService';
import { storage, appwriteConfig } from '../config';

vi.mock('../config', () => ({
    storage: {
        createFile: vi.fn(),
        getFilePreview: vi.fn(),
        getFileView: vi.fn(),
        deleteFile: vi.fn(),
    },
    appwriteConfig: {
        storageId: 'test-bucket',
    },
}));

describe('storageService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('uploadFile', () => {
        it('should upload a file successfully', async () => {
            const mockFile = new File(['hello'], 'hello.png', { type: 'image/png' });
            vi.mocked(storage.createFile).mockResolvedValue({ $id: 'file-123' } as any);

            const result = await storageService.uploadFile(mockFile);

            expect(storage.createFile).toHaveBeenCalledWith(
                'test-bucket',
                expect.any(String),
                mockFile,
                undefined,
                undefined
            );
            expect(result.$id).toBe('file-123');
        });

        it('should throw an error if file exceeds size limit', async () => {
            const largeFile = { size: 60 * 1024 * 1024 } as any; // 60MB
            await expect(storageService.uploadFile(largeFile)).rejects.toThrow(/File too large/);
        });
    });

    describe('getFilePreview', () => {
        it('should return a preview URL (using view for compatibility)', () => {
            vi.mocked(storage.getFileView).mockReturnValue('http://view-url' as any);

            const url = storageService.getFilePreview('file-123');

            expect(storage.getFileView).toHaveBeenCalledWith(
                'test-bucket',
                'file-123'
            );
            expect(url).toBe('http://view-url');
        });

        it('should return an empty string on error', () => {
            vi.mocked(storage.getFileView).mockImplementation(() => {
                throw new Error('SDK Error');
            });

            const url = storageService.getFilePreview('file-123');
            expect(url).toBe('');
        });
    });

    describe('getFileView', () => {
        it('should return a direct view URL', () => {
            vi.mocked(storage.getFileView).mockReturnValue('http://view-url' as any);

            const url = storageService.getFileView('file-123');

            expect(storage.getFileView).toHaveBeenCalledWith('test-bucket', 'file-123');
            expect(url).toBe('http://view-url');
        });
    });

    describe('deleteFile', () => {
        it('should delete a file by ID', async () => {
            vi.mocked(storage.deleteFile).mockResolvedValue({} as any);

            await storageService.deleteFile('file-123');

            expect(storage.deleteFile).toHaveBeenCalledWith('test-bucket', 'file-123');
        });
    });
});
