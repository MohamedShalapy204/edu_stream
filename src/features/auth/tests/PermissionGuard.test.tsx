import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test-utils';
import { PermissionGuard } from '@/features/auth';
import { UserRole } from '@/types';
import * as useAuth from '@/features/auth/hooks/useAuth';
import * as useUser from '@/hooks/useUser';

vi.mock('@/features/auth/hooks/useAuth', () => ({
    useCurrentAccount: vi.fn(),
}));

vi.mock('@/hooks/useUser', () => ({
    useUser: vi.fn(),
}));

describe('PermissionGuard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render children when user has required role', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({ data: { $id: 'user-id' }, isLoading: false } as any);
        vi.mocked(useUser.useUser).mockReturnValue({ data: { role: UserRole.ADMIN }, isLoading: false } as any);

        render(
            <PermissionGuard allowedRoles={[UserRole.ADMIN]}>
                <div data-testid="protected">Admin Content</div>
            </PermissionGuard>
        );

        expect(screen.getByTestId('protected')).toBeInTheDocument();
        expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });

    it('should NOT render children when user has wrong role', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({ data: { $id: 'user-id' }, isLoading: false } as any);
        vi.mocked(useUser.useUser).mockReturnValue({ data: { role: UserRole.STUDENT }, isLoading: false } as any);

        render(
            <PermissionGuard allowedRoles={[UserRole.ADMIN]}>
                <div data-testid="protected">Admin Content</div>
            </PermissionGuard>
        );

        expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });

    it('should render fallback when access is denied', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({ data: { $id: 'user-id' }, isLoading: false } as any);
        vi.mocked(useUser.useUser).mockReturnValue({ data: { role: UserRole.STUDENT }, isLoading: false } as any);

        render(
            <PermissionGuard
                allowedRoles={[UserRole.ADMIN]}
                fallback={<div data-testid="fallback">Access Denied</div>}
            >
                <div>Protected</div>
            </PermissionGuard>
        );

        expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('should render loadingComponent while data is resolving', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({ data: null, isLoading: true } as any);
        vi.mocked(useUser.useUser).mockReturnValue({ data: null, isLoading: false } as any);

        render(
            <PermissionGuard
                loadingComponent={<div data-testid="loading">Loading...</div>}
            >
                <div data-testid="protected">Protected</div>
            </PermissionGuard>
        );

        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });
});
