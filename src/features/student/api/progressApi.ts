import { account } from '@/services/appwrite/config';
import type { IStudentPreferences, ICourseProgress } from '../types';

export const progressApi = {
    /**
     * getStudentProgress
     * Retrieves the progress dictionary stored inside the user's Appwrite Preferences.
     */
    async getStudentProgress(): Promise<Record<string, ICourseProgress>> {
        try {
            const prefs = (await account.getPrefs()) as unknown as IStudentPreferences;
            return prefs.progress || {};
        } catch (error) {
            console.error('[progressApi.getStudentProgress]', error);
            return {};
        }
    },

    /**
     * markLessonComplete
     * Atomically adds a lesson to the completed array for a specific course 
     * within the user's preferences without erasing other course states.
     */
    async markLessonComplete(courseId: string, lessonId: string): Promise<Record<string, ICourseProgress>> {
        try {
            const currentPrefs = (await account.getPrefs()) as unknown as IStudentPreferences;
            const currentProgress = currentPrefs.progress || {};

            const courseProgress: ICourseProgress = currentProgress[courseId] || { completed_lessons: [] };

            // Prevent duplicates
            if (!courseProgress.completed_lessons.includes(lessonId)) {
                courseProgress.completed_lessons.push(lessonId);
            }

            courseProgress.last_accessed_lesson = lessonId;

            const updatedProgress = {
                ...currentProgress,
                [courseId]: courseProgress
            };

            const newPrefs = await account.updatePrefs<IStudentPreferences>({
                ...currentPrefs,
                progress: updatedProgress
            });

            return newPrefs.prefs.progress || {};
        } catch (error) {
            console.error('[progressApi.markLessonComplete]', error);
            throw error;
        }
    },

    /**
     * updateLastAccessed
     * Updates only the tracking anchor without modifying completion status.
     */
    async updateLastAccessed(courseId: string, lessonId: string): Promise<void> {
        try {
            const currentPrefs = (await account.getPrefs()) as unknown as IStudentPreferences;
            const currentProgress = currentPrefs.progress || {};

            const courseProgress: ICourseProgress = currentProgress[courseId] || { completed_lessons: [] };
            courseProgress.last_accessed_lesson = lessonId;

            await account.updatePrefs<IStudentPreferences>({
                ...currentPrefs,
                progress: {
                    ...currentProgress,
                    [courseId]: courseProgress
                }
            });
        } catch (error) {
            console.error('[progressApi.updateLastAccessed]', error);
        }
    }
};
