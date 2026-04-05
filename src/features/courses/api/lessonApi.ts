import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import type { ILesson } from '../types/courseTypes';
import type { IAppwriteDoc } from '@/types';

export const lessonApi = {
    async getSectionLessons(sectionId: string) {
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
            console.error('[lessonApi.getSectionLessons]', error);
            throw error;
        }
    },

    async createLesson(data: Omit<ILesson, keyof IAppwriteDoc>) {
        try {
            return await databases.createDocument<ILesson>(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                ID.unique(),
                data
            );
        } catch (error) {
            console.error('[lessonApi.createLesson]', error);
            throw error;
        }
    },

    async updateLesson(lessonId: string, data: Partial<ILesson>) {
        try {
            return await databases.updateDocument<ILesson>(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                lessonId,
                data
            );
        } catch (error) {
            console.error('[lessonApi.updateLesson]', error);
            throw error;
        }
    },

    async deleteLesson(lessonId: string) {
        try {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.lessonsCollectionId,
                lessonId
            );
        } catch (error) {
            console.error('[lessonApi.deleteLesson]', error);
            throw error;
        }
    }
};
