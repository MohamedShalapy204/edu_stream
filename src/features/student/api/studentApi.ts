import { databases, appwriteConfig } from '@/services/appwrite/config';
import { Query } from 'appwrite';
import type { ISubscription } from '@/types';
import type { ICourse } from '@/features/courses';
import type { IEnrolledCourse } from '../types';

export const studentApi = {
    /**
     * getEnrolledCourses
     * Fetches all active subscriptions for the given user, then deeply resolves the 
     * associated Course documents to render the dashboard catalog.
     */
    async getEnrolledCourses(studentId: string): Promise<IEnrolledCourse[]> {
        try {
            // 1. Fetch active subscriptions for the user
            const subscriptionsResponse = await databases.listDocuments<ISubscription>(
                appwriteConfig.databaseId,
                appwriteConfig.subscriptionsCollectionId,
                [
                    Query.equal('user_id', studentId),
                    Query.equal('status', 'active'),
                    Query.orderDesc('$createdAt')
                ]
            );

            const subscriptions = subscriptionsResponse.documents;

            if (subscriptions.length === 0) return [];

            // 2. Extract unique course IDs
            const courseIds = Array.from(new Set(subscriptions.map(sub => sub.course_id)));

            // 3. Fetch corresponding courses in batches
            const coursesMap = new Map<string, ICourse>();

            // To prevent URL length limits with huge arrays, fetch carefully. 
            // Often we can just loop them concurrently for a dashboard mapping.
            const coursePromises = courseIds.map(id =>
                databases.getDocument<ICourse>(
                    appwriteConfig.databaseId,
                    appwriteConfig.coursesCollectionId,
                    id
                ).catch(err => {
                    console.warn(`[studentApi] Failed to fetch course ${id}`, err);
                    return null;
                })
            );

            const fetchedCourses = await Promise.all(coursePromises);
            fetchedCourses.forEach(course => {
                if (course) coursesMap.set(course.$id, course);
            });

            // 4. Assemble payload
            const enrolledCourses: IEnrolledCourse[] = [];
            for (const sub of subscriptions) {
                const course = coursesMap.get(sub.course_id);
                if (course) {
                    enrolledCourses.push({ subscription: sub, course });
                }
            }

            return enrolledCourses;
        } catch (error) {
            console.error('[studentApi.getEnrolledCourses]', error);
            throw error;
        }
    }
};
