import { useQuery } from '@tanstack/react-query';
import { AppwriteException } from 'appwrite';
import { queryKeys } from '@/keys/queryKeys';
import * as userService from '@/features/auth/api/users';
import { useCurrentAccount } from '@/features/auth';

export function useUser(userId: string) {
    return useQuery({
        queryKey: [...queryKeys.users.current, userId],
        queryFn: async () => {
            try {
                return await userService.getUserDoc(userId);
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