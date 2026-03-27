import { Client, Account, Databases, Storage, Avatars, Functions } from "appwrite";

export const appwriteConfig = {
    endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,

    // ── Collections ──
    usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    coursesCollectionId: import.meta.env.VITE_APPWRITE_COURSES_COLLECTION_ID,
    sectionsCollectionId: import.meta.env.VITE_APPWRITE_SECTIONS_COLLECTION_ID,
    lessonsCollectionId: import.meta.env.VITE_APPWRITE_LESSONS_COLLECTION_ID,
    subscriptionsCollectionId: import.meta.env.VITE_APPWRITE_SUBSCRIPTIONS_COLLECTION_ID,
    paymentsCollectionId: import.meta.env.VITE_APPWRITE_PAYMENTS_COLLECTION_ID,
    reviewsCollectionId: import.meta.env.VITE_APPWRITE_REVIEWS_COLLECTION_ID,
    notificationsCollectionId: import.meta.env.VITE_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
    contentAccessCollectionId: import.meta.env.VITE_APPWRITE_CONTENT_ACCESS_COLLECTION_ID,
}

export const client = new Client();
client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const functions = new Functions(client);