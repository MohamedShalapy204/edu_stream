import { Navigate, useRoutes } from 'react-router-dom';
import { useCurrentAccount, AuthRoutes, AuthLoading } from '@/features/auth';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
    const { data: account, isLoading } = useCurrentAccount();

    const routes = [
        {
            path: '/*',
            element: <AuthRoutes />,
        },
        ...publicRoutes,
        ...(account ? protectedRoutes : []),
        {
            path: '*',
            element: account ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
        }
    ];

    const element = useRoutes(routes);

    if (isLoading) {
        return <AuthLoading />;
    }

    return <>{element}</>;
};
