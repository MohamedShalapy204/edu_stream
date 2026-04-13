import { Query, ID } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import type { IAppwriteDoc } from '@/types';
import type { IUser } from '@/features/auth/types';
import { type IVodafoneEnrollment, VodafoneEnrollmentStatus } from '@/features/payment/types';

export interface ISubscription extends IAppwriteDoc {
    user_id: string;
    course_id: string;
    status: 'active' | 'expired' | 'revoked';
    start_date: string;
    end_date: string;
}

export interface IEnrollmentData {
    subscription: ISubscription;
    user: IUser;
}

export const enrollmentApi = {
    /**
     * getTeacherEnrollments
     * Fetches recent subscriptions for the given course IDs and securely maps 
     * them to the corresponding User profile data.
     */
    async getTeacherEnrollments(courseIds: string[]): Promise<IEnrollmentData[]> {
        if (!courseIds || courseIds.length === 0) return [];

        try {
            const subResponse = await databases.listDocuments<ISubscription>(
                appwriteConfig.databaseId,
                appwriteConfig.subscriptionsCollectionId,
                [
                    Query.equal('course_id', courseIds),
                    Query.orderDesc('$createdAt'),
                    Query.limit(50) // Fetch top 50 recent enrollments for the dashboard
                ]
            );

            const subscriptions = subResponse.documents;
            if (subscriptions.length === 0) return [];

            const uniqueUserIds = Array.from(new Set(subscriptions.map(s => s.user_id)));

            // Fetch users individually to bypass complex Appwrite $id query constraints safely
            const userPromises = uniqueUserIds.map(id =>
                databases.getDocument<IUser>(
                    appwriteConfig.databaseId,
                    appwriteConfig.usersCollectionId,
                    id
                ).catch(() => null) // Ignore deleted or missing accounts gracefully
            );

            const fetchedUsers = await Promise.all(userPromises);
            const validUsers = fetchedUsers.filter(u => u !== null) as IUser[];
            const usersById = new Map(validUsers.map(u => [u.$id, u]));

            return subscriptions.map(sub => ({
                subscription: sub,
                user: usersById.get(sub.user_id) as IUser
            })).filter(data => data.user != null);
        } catch (error) {
            console.error('[enrollmentApi.getTeacherEnrollments]', error);
            throw error;
        }
    },

    async getPendingVodafoneEnrollments(courseIds: string[]): Promise<(IVodafoneEnrollment & { user: IUser })[]> {
        if (!courseIds || courseIds.length === 0) return [];

        try {
            const enrollmentsRes = await databases.listDocuments<IVodafoneEnrollment>(
                appwriteConfig.databaseId,
                appwriteConfig.vodafoneEnrollmentsCollectionId,
                [
                    Query.equal('course_id', courseIds),
                    Query.equal('status', VodafoneEnrollmentStatus.PENDING),
                    Query.orderDesc('$createdAt'),
                    Query.limit(50)
                ]
            );

            const enrollments = enrollmentsRes.documents;
            if (enrollments.length === 0) return [];

            const uniqueUserIds = Array.from(new Set(enrollments.map(e => e.student_id)));

            const userPromises = uniqueUserIds.map(id =>
                databases.getDocument<IUser>(
                    appwriteConfig.databaseId,
                    appwriteConfig.usersCollectionId,
                    id
                ).catch(() => null)
            );

            const fetchedUsers = await Promise.all(userPromises);
            const validUsers = fetchedUsers.filter(u => u !== null) as IUser[];
            const usersById = new Map(validUsers.map(u => [u.$id, u]));

            return enrollments.map(enrollment => ({
                ...enrollment,
                user: usersById.get(enrollment.student_id) as IUser
            })).filter(data => data.user != null);
        } catch (error) {
            console.error('[enrollmentApi.getPendingVodafoneEnrollments]', error);
            throw error;
        }
    },

    async approveVodafoneEnrollment(enrollmentId: string, studentId: string, courseId: string): Promise<void> {
        // 1. Update vodafone enrollment status
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.vodafoneEnrollmentsCollectionId,
            enrollmentId,
            { status: VodafoneEnrollmentStatus.APPROVED }
        );

        // 2. Create actual Subscription
        const now = new Date();
        const futureDate = new Date();
        futureDate.setFullYear(now.getFullYear() + 10); // Lifetime / 10 year access

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.subscriptionsCollectionId,
            ID.unique(),
            {
                user_id: studentId,
                course_id: courseId,
                status: 'active',
                start_date: now.toISOString(),
                end_date: futureDate.toISOString()
            }
        );
    },

    async denyVodafoneEnrollment(enrollmentId: string): Promise<void> {
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.vodafoneEnrollmentsCollectionId,
            enrollmentId,
            { status: VodafoneEnrollmentStatus.DENIED }
        );
    }
};
