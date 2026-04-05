import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import type { ICourse } from '../types/courseTypes';
import type { IAppwriteDoc } from '@/types';

/**
 * 📚 courseApi
 * 
 * Centralized API service for the Courses feature.
 * Encapsulates Appwrite document interactions.
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
     * createCourse
     * Registers a new scholarly course in the Atheneum.
     */
    async createCourse(data: Omit<ICourse, keyof IAppwriteDoc>) {
        try {
            return await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                ID.unique(),
                data
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
            return await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                courseId,
                data
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
