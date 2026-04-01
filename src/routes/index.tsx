import { useRoutes } from 'react-router-dom';
import { useCurrentAccount, AuthRoutes } from '@/features/auth';
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
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-900">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-blue-500" />
            </div>
        );
    }

    return <>{element}</>;
};
