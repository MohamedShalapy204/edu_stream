import { useQuery } from '@tanstack/react-query';
import { AppwriteException } from 'appwrite';
import { queryKeys } from '../keys/queryKeys';
import * as userService from '../services/appwrite/databases/userService';

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