import { AppwriteException } from 'appwrite';
import { databases, appwriteConfig } from '@/services/appwrite/config';
import type { IUser, UserRole } from '../types';
import type { IAppwriteDoc } from '@/types';



/**
 * Creates a new user document in the Users collection.
 */
export async function createUserDoc(
    userId: string,
    data: {
        name: string;
        email: string;
        role: UserRole;
        avatar_url?: string;
        bio?: string;
    },
): Promise<IUser> {
    try {
        const userDoc = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            data,
        );
        return userDoc as unknown as IUser;
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            if (error.code === 409) {
                error.message = '[UserService:createUserDoc] User profile already exists.';
            } else {
                error.message = `[UserService:createUserDoc] ${error.message}`;
            }
        }
        throw error;
    }
}

/**
 * Fetches a user document by its ID.
 */
export async function getUserDoc(userId: string): Promise<IUser> {
    try {
        const userDoc = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
        );
        return userDoc as unknown as IUser;
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            if (error.code === 404) {
                error.message = '[UserService:getUserDoc] User profile not found.';
            } else {
                error.message = `[UserService:getUserDoc] ${error.message}`;
            }
        }
        throw error;
    }
}

export async function updateUserDoc(
    userId: string,
    data: Partial<Omit<IUser, keyof IAppwriteDoc>>,
): Promise<IUser> {
    try {
        const userDoc = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            data,
        );
        return userDoc as unknown as IUser;
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            if (error.code === 404) {
                error.message = '[UserService:updateUserDoc] Cannot update profile: user not found.';
            } else {
                error.message = `[UserService:updateUserDoc] ${error.message}`;
            }
        }
        throw error;
    }
}
