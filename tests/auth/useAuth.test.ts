import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '../test-utils';
import { useRegister, useLogin, useLogout } from '../../src/hooks/useAuth';
import * as authService from '../../src/services/appwrite/auth/authService';
import * as userService from '../../src/services/appwrite/databases/userService';
import { UserRole } from '../../src/types';
import { AppwriteException } from 'appwrite';

vi.mock('../../src/services/appwrite/auth/authService');
vi.mock('../../src/services/appwrite/databases/userService');
vi.mock('../../src/services/appwrite/config', () => ({
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
