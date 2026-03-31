import { ID } from 'appwrite';
import { storage, appwriteConfig } from '../config';

/**
 * STORAGE_SIZE_LIMIT: 50MB (Appwrite Cloud Free Standard)
 */
const STORAGE_SIZE_LIMIT = 50 * 1024 * 1024;

export const storageService = {
    /**
     * Uploads a file to Appwrite Storage with a size guard.
     */
    async uploadFile(file: File) {
        if (file.size > STORAGE_SIZE_LIMIT) {
            throw new Error(`File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max allowed is 50MB on Free Plan.`);
        }

        try {
            return await storage.createFile(
                appwriteConfig.storageId,
                ID.unique(),
                file
            );
        } catch (error) {
            console.error('[StorageService.uploadFile]', error);
            throw error;
        }
    },

    /**
     * Gets a preview URL for an image (e.g. course thumbnail).
     */
    getFilePreview(fileId: string, width = 800, height = 450) {
        try {
            return storage.getFilePreview(
                appwriteConfig.storageId,
                fileId,
                width,
                height
            );
        } catch (error) {
            console.error('[StorageService.getFilePreview]', error);
            return '';
        }
    },

    /**
     * Gets a direct view URL for a file (e.g. PDF lesson).
     */
    getFileView(fileId: string) {
        try {
            return storage.getFileView(appwriteConfig.storageId, fileId);
        } catch (error) {
            console.error('[StorageService.getFileView]', error);
            return '';
        }
    },

    /**
     * Deletes a file from storage.
     */
    async deleteFile(fileId: string) {
        try {
            return await storage.deleteFile(appwriteConfig.storageId, fileId);
        } catch (error) {
            console.error('[StorageService.deleteFile]', error);
            throw error;
        }
    }
};
