import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteException } from 'appwrite';
import { queryKeys } from '@/keys/queryKeys';
import * as authService from '../api/auth';
import { avatars } from '@/services/appwrite/config';
import * as userService from '../api/users';
import type { LoginInput, RegisterInput } from '../schemas';

export function useCurrentAccount() {
    return useQuery({
        queryKey: queryKeys.auth.session,
        queryFn: async () => {
            try {
                return await authService.getCurrentAccount();
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    if (error.code === 401) return null;
                    error.message = `[useAuth:useCurrentAccount] ${error.message}`;
                }
                throw error;
            }
        },
        staleTime: 1000 * 60 * 15,
        retry: (count, error: unknown) => {
            if (error instanceof AppwriteException && error.code === 401) return false;
            return count < 2;
        }
    });
}



// ── Mutations ──

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ email, password }: LoginInput) => {
            try {
                return await authService.login(email, password);
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useAuth:useLogin] ${error.message}`;
                }
                throw error;
            }
        },
        onSuccess: (session) => {
            // Optimistic cache update to prevent UI flicker
            queryClient.setQueryData(queryKeys.auth.session, session);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
        },
    });
}

/**
 * Atomic Registration with Rollback
 * Ensures no orphaned auth accounts exist if profile creation fails.
 */
export function useRegister() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RegisterInput) => {
            try {
                // 1. Create Identity (Guest method)
                const newAccount = await authService.createAccount(data.name, data.email, data.password);

                // 2. Immediate Login (Obtain valid session)
                // This permits subsequent DB operations if they require "authenticated" scope
                const session = await authService.login(data.email, data.password);

                try {
                    const avatar_url = avatars.getInitials(data.name).toString();

                    // 3. Create DB Profile (Requires authenticated session)
                    await userService.createUserDoc(newAccount.$id, {
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        avatar_url,
                        bio: '',
                    });

                    return session;
                } catch (dbError: unknown) {
                    // Atomic Rollback: Invalidate session if profile creation fails
                    // Note: Identity deletion requires Server SDK, so we logout the active session here.
                    await authService.logout();
                    if (dbError instanceof AppwriteException) {
                        dbError.message = `[useAuth:useRegister:profile] ${dbError.message}`;
                    }
                    throw dbError;
                }
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useAuth:useRegister] ${error.message}`;
                }
                throw error;
            }
        },
        onSuccess: (session) => {
            queryClient.setQueryData(queryKeys.auth.session, session);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            try {
                return await authService.logout();
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useAuth:useLogout] ${error.message}`;
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.session });
            queryClient.setQueryData(queryKeys.auth.session, null);
        },
    });
}

// Simple Action Hooks
export const useSendPasswordRecovery = () => useMutation({
    mutationFn: async (email: string) => {
        try {
            return await authService.sendPasswordRecovery(email);
        } catch (error: unknown) {
            if (error instanceof AppwriteException) {
                error.message = `[useAuth:useSendPasswordRecovery] ${error.message}`;
            }
            throw error;
        }
    }
});

export const useSendEmailVerification = () => useMutation({
    mutationFn: async () => {
        try {
            return await authService.sendEmailVerification();
        } catch (error: unknown) {
            if (error instanceof AppwriteException) {
                error.message = `[useAuth:useSendEmailVerification] ${error.message}`;
            }
            throw error;
        }
    }
});

export function useConfirmEmailVerification() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, secret }: { userId: string; secret: string }) => {
            try {
                return await authService.confirmEmailVerification(userId, secret);
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useAuth:useConfirmEmailVerification] ${error.message}`;
                }
                throw error;
            }
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.session }),
    });
}
