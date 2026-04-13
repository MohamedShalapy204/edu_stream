import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppwriteException } from 'appwrite';
import { queryKeys } from '@/keys/queryKeys';
import * as userApi from '@/api/userApi';
import { useCurrentAccount } from '@/features/auth';
import type { IUser } from '@/types';

export function useUser(userId: string) {
    return useQuery({
        queryKey: [...queryKeys.users.current, userId],
        queryFn: async () => {
            try {
                return await userApi.getUserDoc(userId);
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useUser:useUser] ${error.message}`;
                }
                throw error;
            }
        },
        enabled: !!userId,
        staleTime: 1000 * 60 * 60,
    });
}

export function useCurrentUser() {
    const { data: account } = useCurrentAccount();
    return useUser(account?.$id || '');
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: Partial<IUser> }) => {
            try {
                return await userApi.updateUserDoc(userId, data);
            } catch (error: unknown) {
                if (error instanceof AppwriteException) {
                    error.message = `[useAuth:useUpdateUser] ${error.message}`;
                }
                throw error;
            }
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.users.current, variables.userId] });
        },
    });
}
