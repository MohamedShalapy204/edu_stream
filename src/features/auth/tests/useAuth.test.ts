import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@/test-utils';
import { useRegister, useLogin, useLogout } from '@/features/auth';
import * as authService from '@/features/auth/api/auth';
import * as userService from '@/features/auth/api/users';
import { UserRole } from '@/types';
import { AppwriteException } from 'appwrite';

vi.mock('@/features/auth/api/auth');
vi.mock('@/features/auth/api/users');
vi.mock('@/services/appwrite/config', () => ({
    avatars: {
        getInitials: vi.fn(() => ({ toString: () => 'avatar-url' })),
    },
}));

describe('useAuth hooks (Clean Senior Standard)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useLogin', () => {
        it('should call authService.login', async () => {
            vi.mocked(authService.login).mockResolvedValue({ $id: 'session-id' } as any);

            const { result } = renderHook(() => useLogin());

            await act(async () => {
                await result.current.mutateAsync({ email: 'test@example.com', password: 'password' });
            });

            expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
        });
    });

    describe('useRegister (Atomic Rollback with Logout)', () => {
        it('should call logout if DB profile creation fails', async () => {
            vi.mocked(authService.createAccount).mockResolvedValue({ $id: 'new-id' } as any);
            vi.mocked(userService.createUserDoc).mockRejectedValue(new AppwriteException('DB Fail', 500));
            vi.mocked(authService.logout).mockResolvedValue(undefined);

            const { result } = renderHook(() => useRegister());

            await act(async () => {
                try {
                    await result.current.mutateAsync({
                        name: 'New User',
                        email: 'new@example.com',
                        password: 'password123',
                        confirmPassword: 'password123',
                        role: UserRole.STUDENT
                    });
                } catch {
                    // expected
                }
            });

            expect(authService.logout).toHaveBeenCalled();
        });
    });

    describe('useLogout', () => {
        it('should call authService.logout', async () => {
            vi.mocked(authService.logout).mockResolvedValue(undefined);

            const { result } = renderHook(() => useLogout());

            await act(async () => {
                await result.current.mutateAsync();
            });

            expect(authService.logout).toHaveBeenCalled();
        });
    });
});
