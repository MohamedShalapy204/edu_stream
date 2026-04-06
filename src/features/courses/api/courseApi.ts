import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import { storageService } from '@/services/appwrite/storage/storageService';
import type { ICourse } from '../types/courseTypes';
import type { IAppwriteDoc } from '@/types';

/**
 * 📚 courseApi
 * 
 * Centralized API service for the Courses feature.
 * Encapsulates Appwrite document and storage interactions.
 */
export const courseApi = {
    /**
     * listCourses
     * Fetches a list of published courses with optional filters.
     */
    async listCourses(queries: string[] = []) {
        try {
            return await databases.listDocuments<ICourse>(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                [
                    Query.orderDesc('$createdAt'),
                    ...queries
                ]
            );
        } catch (error) {
            console.error('[courseApi.listCourses]', error);
            throw error;
        }
    },

    /**
     * getCourse
     * Fetches a single course by its unique identifier.
     */
    async getCourse(courseId: string) {
        try {
            return await databases.getDocument<ICourse>(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                courseId
            );
        } catch (error) {
            console.error('[courseApi.getCourse]', error);
            throw error;
        }
    },

    /**
     * handleThumbnail
     * Processes file upload and returns updated metadata.
     */
    async handleThumbnail(file: File) {
        const uploadedFile = await storageService.uploadFile(file);
        const thumbnailUrl = storageService.getFilePreview(uploadedFile.$id).toString();

        return {
            thumbnail_id: uploadedFile.$id,
            thumbnail_url: thumbnailUrl
        };
    },

    /**
     * createCourse
     * Registers a new scholarly course in the Atheneum.
     */
    async createCourse(data: Omit<ICourse, keyof IAppwriteDoc>) {
        try {
            const { thumbnail, ...payload } = data as any;
            let finalPayload = { ...payload };

            if (thumbnail instanceof File) {
                const meta = await this.handleThumbnail(thumbnail);
                finalPayload = { ...finalPayload, ...meta };
            }

            return await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                ID.unique(),
                finalPayload
            );
        } catch (error) {
            console.error('[courseApi.createCourse]', error);
            throw error;
        }
    },

    /**
     * updateCourse
     * Refines the metadata of an existing course.
     */
    async updateCourse(courseId: string, data: Partial<ICourse>) {
        try {
            const { thumbnail, ...payload } = data as any;
            let finalPayload = { ...payload };

            if (thumbnail instanceof File) {
                const meta = await this.handleThumbnail(thumbnail);
                finalPayload = { ...finalPayload, ...meta };
            }

            // Remove internal properties before sending to Appwrite
            const cleanedPayload: any = {};
            const allowedFields = ['title', 'description', 'price', 'is_published', 'categories', 'thumbnail_id', 'thumbnail_url', 'teacher_id', 'total_students', 'rating', 'duration', 'language'];

            Object.keys(finalPayload).forEach(key => {
                if (allowedFields.includes(key)) {
                    cleanedPayload[key] = finalPayload[key];
                }
            });

            return await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                courseId,
                cleanedPayload
            );
        } catch (error) {
            console.error('[courseApi.updateCourse]', error);
            throw error;
        }
    },

    /**
     * deleteCourse
     * Removes a course from the available catalog.
     */
    async deleteCourse(courseId: string) {
        try {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                courseId
            );
        } catch (error) {
            console.error('[courseApi.deleteCourse]', error);
            throw error;
        }
    }
};
