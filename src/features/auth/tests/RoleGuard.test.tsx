import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test-utils';
import { RoleGuard } from '@/features/auth';
import * as useAuth from '@/features/auth/hooks/useAuth';
import * as useUser from '@/hooks/useUser';
import { UserRole } from '@/types';
import { Routes, Route } from 'react-router-dom';

vi.mock('@/features/auth/hooks/useAuth', () => ({
    useCurrentAccount: vi.fn(),
}));

vi.mock('@/hooks/useUser', () => ({
    useUser: vi.fn(),
}));

describe('RoleGuard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render children when user has required role', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: { $id: 'user-id' },
            isLoading: false,
        } as any);
        vi.mocked(useUser.useUser).mockReturnValue({
            data: { role: UserRole.ADMIN },
            isLoading: false,
        } as any);

        render(
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <div data-testid="protected">Admin Content</div>
            </RoleGuard>
        );

        expect(screen.getByTestId('protected')).toBeInTheDocument();
    });

    it('should NOT render children and redirect to unauthorized when user has wrong role', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: { $id: 'user-id' },
            isLoading: false,
        } as any);
        vi.mocked(useUser.useUser).mockReturnValue({
            data: { role: UserRole.STUDENT },
            isLoading: false,
        } as any);

        render(
            <Routes>
                <Route path="/" element={
                    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                        <div>Protected</div>
                    </RoleGuard>
                } />
                <Route path="/unauthorized" element={<div data-testid="unauthorized">Unauthorized</div>} />
            </Routes>,
            { initialEntries: ['/'] }
        );

        expect(screen.getByTestId('unauthorized')).toBeInTheDocument();
        expect(screen.queryByText('Protected')).not.toBeInTheDocument();
    });

    it('should render nothing while loading', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: null,
            isLoading: true,
        } as any);

        render(
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <div data-testid="protected">Protected</div>
            </RoleGuard>
        );

        expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });
});
