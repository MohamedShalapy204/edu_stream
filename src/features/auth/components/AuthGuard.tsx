import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useCurrentAccount } from '../hooks/useAuth';

/**
 * 🛡️ AuthGuard (The Bouncer)
 * 
 * This is the first line of defense at the Routing level.
 * It checks for a valid identity in Appwrite before allowing any rendering.
 */
export const AuthGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { data: account, isLoading, isError } = useCurrentAccount();
    const location = useLocation();

    // 1. Loading State: Prevents UI "flash" while verifying identity.
    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900">
                {/*  Senior Tip: Use a dedicated AppLoader component here for branding */}
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
            </div>
        );
    }

    // 2. Unauthenticated: Redirect to login while preserving intended destination.
    if (!account || isError) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Authorized: Render nested routes (Outlet) or passed children.
    return children ? <>{children}</> : <Outlet />;
};

/**
 * 🔓 GuestGuard (The Reverse Bouncer)
 * 
 * Prevents logged-in users from accessing Login/Register pages.
 */
export const GuestGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: account, isLoading } = useCurrentAccount();

    if (isLoading) return null; // Avoid flicker

    if (account) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
