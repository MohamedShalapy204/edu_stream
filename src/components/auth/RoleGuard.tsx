import type { PropsWithChildren } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentAccount } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import type { UserRole } from '../../types';

interface RoleGuardProps extends PropsWithChildren {
    allowedRoles: UserRole[];
}

/**
 * 🛂 RoleGuard
 * 
 * Specifically for routing-level role enforcement.
 */
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
    const { data: account, isLoading: isAuthLoading } = useCurrentAccount();
    const { data: userProfile, isLoading: isProfileLoading } = useUser(account?.$id || '');

    const isLoading = isAuthLoading || (!!account && isProfileLoading);

    if (isLoading) return <p>Loading...</p>;

    if (!account) {
        return <Navigate to="/login" replace />;
    }

    if (!userProfile || !allowedRoles.includes(userProfile.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
}
