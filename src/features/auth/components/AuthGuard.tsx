import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCurrentAccount } from '../hooks/useAuth';
import UnverifiedPage from '../routes/UnverifiedPage';
import AuthLoading from './Loading';

/**
 * 🛡️ AuthGuard (The Bouncer)
 */
export const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { data: account, isLoading, isError } = useCurrentAccount();
    const location = useLocation();

    if (isLoading) {
        return <AuthLoading />;
    }

    if (!account || isError) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Email Verification Guard
    if (!account.emailVerification) {
        return <UnverifiedPage />;
    }

    return children ? <>{children}</> : <Outlet />;
};

/**
 * 🔓 GuestGuard (The Reverse Bouncer)
 * 
 * Prevents logged-in users from accessing Login/Register pages.
 */
export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: account, isLoading } = useCurrentAccount();

    if (isLoading) return null;

    if (account) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
