import { ID, AppwriteException } from 'appwrite';
import { account, appwriteConfig } from '@/services/appwrite/config';
import type { IAccount } from '@/types';

/**
 * Creates a new Appwrite Account.
 */
export async function createAccount(
    name: string,
    email: string,
    password: string,
): Promise<IAccount> {
    try {
        const userAccount = await account.create(
            ID.unique(),
            email,
            password,
            name,
        );
        return userAccount as unknown as IAccount;
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            if (error.code === 409) {
                error.message = '[AuthService:createAccount] An account with this email already exists.';
            } else {
                error.message = `[AuthService:createAccount] ${error.message}`;
            }
        }
        throw error;
    }
}

/**
 * Login an existing user and return the active session.
 */
export async function login(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            if (error.code === 401) {
                error.message = '[AuthService:login] Invalid email or password. Please try again.';
            } else {
                error.message = `[AuthService:login] ${error.message}`;
            }
        }
        throw error;
    }
}

/**
 * Logout the current session.
 */
export async function logout(): Promise<void> {
    try {
        await account.deleteSession('current');
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            error.message = `[AuthService:logout] ${error.message}`;
        }
        throw error;
    }
}

/**
 * Get the currently authenticated Appwrite Account.
 * Map result to IAccount.
 */
export async function getCurrentAccount(): Promise<IAccount> {
    try {
        const response = await account.get();
        return response as unknown as IAccount;
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            if (error.code === 401) {
                error.message = '[AuthService:getCurrentAccount] User is not authenticated.';
            } else {
                error.message = `[AuthService:getCurrentAccount] ${error.message}`;
            }
        }
        throw error;
    }
}


/**
 * Send a password recovery email.
 */
export async function sendPasswordRecovery(email: string): Promise<void> {
    try {
        const redirectUrl = `${appwriteConfig.baseUrl}/reset-password`;
        await account.createRecovery(email, redirectUrl);
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            error.message = `[AuthService:sendPasswordRecovery] ${error.message}`;
        }
        throw error;
    }
}

/**
 * Complete password recovery using the token from the email link.
 */
export async function confirmPasswordRecovery(
    userId: string,
    secret: string,
    newPassword: string,
): Promise<void> {
    try {
        await account.updateRecovery(userId, secret, newPassword);
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            error.message = `[AuthService:confirmPasswordRecovery] ${error.message}`;
        }
        throw error;
    }
}

/**
 * Send an email verification link to the current user.
 */
export async function sendEmailVerification(): Promise<void> {
    try {
        const redirectUrl = `${appwriteConfig.baseUrl}/verify-email`;
        await account.createVerification(redirectUrl);
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            error.message = `[AuthService:sendEmailVerification] ${error.message}`;
        }
        throw error;
    }
}

/**
 * Complete email verification using the token from the email link.
 */
export async function confirmEmailVerification(userId: string, secret: string): Promise<void> {
    try {
        await account.updateVerification(userId, secret);
    } catch (error: unknown) {
        if (error instanceof AppwriteException) {
            error.message = `[AuthService:confirmEmailVerification] ${error.message}`;
        }
        throw error;
    }
}
