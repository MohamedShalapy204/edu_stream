import { useRoutes } from 'react-router-dom';
import { useCurrentAccount, AuthRoutes, AuthLoading } from '@/features/auth';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
    const { data: account, isLoading } = useCurrentAccount();

    const authRootRoutes = [
        {
            path: '/*',
            element: <AuthRoutes />,
        },
    ];

    const routes = account ? protectedRoutes : [...authRootRoutes, ...publicRoutes];

    const element = useRoutes(routes);

    if (isLoading) {
        return <AuthLoading />;
    }

    return <>{element}</>;
};
