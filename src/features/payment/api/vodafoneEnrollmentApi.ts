import { ID, Query } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import { type IVodafoneEnrollment } from '../types';

export const createEnrollment = async (data: Omit<IVodafoneEnrollment, '$id' | '$createdAt' | '$updatedAt' | '$databaseId' | '$collectionId' | '$permissions' | '$sequence'>) => {
    return await databases.createDocument<IVodafoneEnrollment>(
        appwriteConfig.databaseId,
        appwriteConfig.vodafoneEnrollmentsCollectionId,
        ID.unique(),
        data
    );
};

export const getEnrollmentForCourse = async (courseId: string, studentId: string) => {
    const response = await databases.listDocuments<IVodafoneEnrollment>(
        appwriteConfig.databaseId,
        appwriteConfig.vodafoneEnrollmentsCollectionId,
        [
            Query.equal('course_id', courseId),
            Query.equal('student_id', studentId),
            Query.orderDesc('$createdAt'),
            Query.limit(1)
        ]
    );

    return response.documents[0] || null;
};
