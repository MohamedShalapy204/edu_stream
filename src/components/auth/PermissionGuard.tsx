import React from 'react';
import { useCurrentAccount } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';
import { UserRole } from '../../types';

interface PermissionGuardProps {
    /**
     * Required roles to access the children.
     * If empty, any authenticated user with a valid profile can access.
     */
    allowedRoles?: UserRole[];
    /**
     * Optional message or component to show when access is denied or profile is loading.
     */
    fallback?: React.ReactNode;
    /**
     * Content to show while the profile data is resolving.
     */
    loadingComponent?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * 🛡️ PermissionGuard: Systematically enforces Role-Based Access Control (RBAC).
 * 
 * It coordinates with useCurrentAccount (Identity) and useUser (Profile) 
 * to verify cross-collection permissions before rendering.
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
    allowedRoles = [],
    fallback = null,
    loadingComponent = null,
    children,
}) => {
    // 1. Fetch Identity
    const { data: account, isLoading: isAuthLoading } = useCurrentAccount();

    // 2. Fetch Profile based on Identity
    const { data: userProfile, isLoading: isProfileLoading } = useUser(account?.$id || '');

    const isLoading = isAuthLoading || (!!account && isProfileLoading);

    // ── Handling Pre-Access States ──

    // 1. Loading Profile: Avoid layout shifts/flashes
    if (isLoading) {
        return <>{loadingComponent}</>;
    }

    // 2. Not Authenticated or Profile not found
    if (!account || !userProfile) {
        return <>{fallback}</>;
    }

    // 3. Unauthorized: Role check
    if (allowedRoles.length > 0 && !allowedRoles.includes(userProfile.role)) {
        return <>{fallback}</>;
    }

    // 4. Authorized
    return <>{children}</>;
};

/**
 * 🏢 Role-Based Route HOC
 * 
 * Reusable wrapper for protecting entire page components in the Router.
 */
export function WithRole<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: UserRole[] = []
) {
    return function WrappedComponent(props: P) {
        return (
            <PermissionGuard
                allowedRoles={allowedRoles}
                fallback={<div className="p-8 text-center text-white/50">403 Forbidden: Insufficient Permissions</div>}
            >
                <Component {...props} />
            </PermissionGuard>
        );
    };
}
