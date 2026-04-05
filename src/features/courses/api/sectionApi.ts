import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import type { ISection } from '../types/courseTypes';
import type { IAppwriteDoc } from '@/types';

export const sectionApi = {
    async getCourseSections(courseId: string) {
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
            console.error('[sectionApi.getCourseSections]', error);
            throw error;
        }
    },

    async createSection(data: Omit<ISection, keyof IAppwriteDoc>) {
        try {
            return await databases.createDocument<ISection>(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                ID.unique(),
                data
            );
        } catch (error) {
            console.error('[sectionApi.createSection]', error);
            throw error;
        }
    },

    async updateSection(sectionId: string, data: Partial<ISection>) {
        try {
            return await databases.updateDocument<ISection>(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                sectionId,
                data
            );
        } catch (error) {
            console.error('[sectionApi.updateSection]', error);
            throw error;
        }
    },

    async deleteSection(sectionId: string) {
        try {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sectionsCollectionId,
                sectionId
            );
        } catch (error) {
            console.error('[sectionApi.deleteSection]', error);
            throw error;
        }
    }
};
