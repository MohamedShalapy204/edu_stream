import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test-utils';
import { ProtectedLayoutWrapper } from '@/routes/ProtectedLayoutWrapper';
import { PaymentPage } from '@/features/payment';
import * as useAuth from '@/features/auth/hooks/useAuth';
import { Routes, Route } from 'react-router-dom';

vi.mock('@/features/auth/hooks/useAuth', () => ({
    useCurrentAccount: vi.fn(),
}));

// Mock component that is used in the route
vi.mock('@/features/payment/pages/PaymentPage', () => ({
    default: () => <div data-testid="payment-page">Payment Page</div>,
}));

describe('Payment Page Access', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should redirect unauthenticated guests to login from /payment/:courseId', () => {
        // Setup mock for unauthenticated user
        vi.mocked(useAuth.useCurrentAccount).mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        } as any);

        render(
            <Routes>
                <Route element={<ProtectedLayoutWrapper />}>
                    <Route path="/payment/:courseId" element={<PaymentPage />} />
                </Route>
                <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            </Routes>,
            { initialEntries: ['/payment/123'] }
        );

        // AuthGuard should trigger a Navigate to /login
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
        expect(screen.queryByTestId('payment-page')).not.toBeInTheDocument();
    });
});
