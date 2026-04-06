import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test-utils';
import { AuthGuard } from '@/features/auth';
import * as useAuth from '@/features/auth/hooks/useAuth';
import { Routes, Route } from 'react-router-dom';

vi.mock('@/features/auth/hooks/useAuth', () => ({
    useCurrentAccount: vi.fn(),
}));

describe('AuthGuard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render children when authenticated and verified', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: { $id: 'user-id', emailVerification: true },
            isLoading: false,
        } as unknown as any);

        render(
            <AuthGuard>
                <div data-testid="protected">Protected Content</div>
            </AuthGuard>
        );

        expect(screen.getByTestId('protected')).toBeInTheDocument();
    });

    it('should redirect to login if not authenticated', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: null,
            isLoading: false,
        } as unknown as any);

        render(
            <Routes>
                <Route path="/" element={
                    <AuthGuard>
                        <div>Protected</div>
                    </AuthGuard>
                } />
                <Route path="/login" element={<div data-testid="login">Login Page</div>} />
            </Routes>,
            { initialEntries: ['/'] }
        );

        expect(screen.getByTestId('login')).toBeInTheDocument();
    });

    it('should show loader while loading session', () => {
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: null,
            isLoading: true,
        } as unknown as any);

        render(
            <AuthGuard>
                <div data-testid="protected">Protected</div>
            </AuthGuard>
        );

        // The loader is the EDUstream branded component
        expect(screen.getByText(/EDU/i)).toBeInTheDocument();
        expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
    });
});
