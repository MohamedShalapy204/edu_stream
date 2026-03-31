import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '../config';
import type { ISection, IAppwriteDoc } from '../../../types';

export const sectionService = {
    /**
     * Creates a new section within a course.
     */
    async createSection(data: Omit<ISection, keyof IAppwriteDoc>) {
        try {
            return await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                ID.unique(),
                data
            );
        } catch (error) {
            console.error('[SectionService.createSection]', error);
            throw error;
        }
    },

    /**
     * Lists all sections for a specific course, ordered by 'order'.
     */
    async listCourseSections(courseId: string) {
        try {
            return await databases.listDocuments<ISection>(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                [
                    Query.equal('course_id', courseId),
                    Query.orderAsc('order')
                ]
            );
        } catch (error) {
            console.error('[SectionService.listCourseSections]', error);
            throw error;
        }
    },

    /**
     * Updates a section.
     */
    async updateSection(sectionId: string, data: Partial<ISection>) {
        try {
            return await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                sectionId,
                data
            );
        } catch (error) {
            console.error('[SectionService.updateSection]', error);
            throw error;
        }
    },

    /**
     * Deletes a section.
     */
    async deleteSection(sectionId: string) {
        try {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                sectionId
            );
        } catch (error) {
            console.error('[SectionService.deleteSection]', error);
            throw error;
        }
    }
};
