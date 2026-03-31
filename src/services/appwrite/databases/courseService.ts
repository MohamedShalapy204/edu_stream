import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '../config';
import type { ICourse, IAppwriteDoc } from '../../../types';

export const courseService = {
    /**
     * Creates a new course document.
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
            console.error('[CourseService.createCourse]', error);
            throw error;
        }
    },

    /**
     * Gets a list of courses with optional filters and pagination.
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
            console.error('[CourseService.listCourses]', error);
            throw error;
        }
    },

    /**
     * Gets courses created by a specific teacher.
     */
    async listTeacherCourses(teacherId: string) {
        return this.listCourses([Query.equal('teacher_id', teacherId)]);
    },

    /**
     * Gets a single course by ID.
     */
    async getCourse(courseId: string) {
        try {
            return await databases.getDocument<ICourse>(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                courseId
            );
        } catch (error) {
            console.error('[CourseService.getCourse]', error);
            throw error;
        }
    },

    /**
     * Updates an existing course.
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
            console.error('[CourseService.updateCourse]', error);
            throw error;
        }
    },

    /**
     * Deletes a course.
     */
    async deleteCourse(courseId: string) {
        try {
            return await databases.deleteDocument(
                appwriteConfig.databaseId,
                appwriteConfig.coursesCollectionId,
                courseId
            );
        } catch (error) {
            console.error('[CourseService.deleteCourse]', error);
            throw error;
        }
    }
};
