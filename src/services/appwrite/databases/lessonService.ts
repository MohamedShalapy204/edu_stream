import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '../config';
import type { ILesson, IAppwriteDoc } from '../../../types';

export const lessonService = {
    /**
     * Creates a new lesson within a section.
     */
    async createLesson(data: Omit<ILesson, keyof IAppwriteDoc>) {
        try {
            return await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                ID.unique(),
                data
            );
        } catch (error) {
            console.error('[LessonService.createLesson]', error);
            throw error;
        }
    },

    /**
     * Lists all lessons for a specific section, ordered by 'order'.
     */
    async listSectionLessons(sectionId: string) {
        try {
            return await databases.listDocuments<ILesson>(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                [
                    Query.equal('section_id', sectionId),
                    Query.orderAsc('order')
                ]
            );
        } catch (error) {
            console.error('[LessonService.listSectionLessons]', error);
            throw error;
        }
    },

    /**
     * Gets a single lesson by ID.
     */
    async getLesson(lessonId: string) {
        try {
            return await databases.getDocument<ILesson>(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                lessonId
            );
        } catch (error) {
            console.error('[LessonService.getLesson]', error);
            throw error;
        }
    },

    /**
     * Updates a lesson.
     */
    async updateLesson(lessonId: string, data: Partial<ILesson>) {
        try {
            return await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                lessonId,
                data
            );
        } catch (error) {
            console.error('[LessonService.updateLesson]', error);
            throw error;
        }
    },

    /**
     * Deletes a lesson.
     */
    async deleteLesson(lessonId: string) {
        try {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                lessonId
            );
        } catch (error) {
            console.error('[LessonService.deleteLesson]', error);
            throw error;
        }
    }
};
