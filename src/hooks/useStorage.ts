import { useMutation } from '@tanstack/react-query';
import { storageService } from '../services/appwrite/storage/storageService';
import { AppwriteException } from 'appwrite';

export function useUploadFile() {
    return useMutation({
        mutationFn: async (file: File) => {
            try {
                return await storageService.uploadFile(file);
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useStorage:useUploadFile] ${error.message}`;
                }
                throw error;
            }
        }
    });
}

export function useDeleteFile() {
    return useMutation({
        mutationFn: async (fileId: string) => {
            try {
                return await storageService.deleteFile(fileId);
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useStorage:useDeleteFile] ${error.message}`;
                }
                throw error;
            }
        },
        onSuccess: () => {
            // Storage doesn't have a simple list query to invalidate easily,
            // but we might want to invalidate specific course data that uses this file.
        }
    });
}
