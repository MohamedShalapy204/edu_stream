import { useRoutes } from 'react-router-dom';
import { useCurrentAccount, authRoutes, AuthLoading } from '@/features/auth';
import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes = () => {
    const { data: account, isLoading } = useCurrentAccount();

    const routes = [
        ...authRoutes,
        ...publicRoutes,
        ...(account ? protectedRoutes : []),
    ];

    const element = useRoutes(routes);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <AuthLoading />
            </div>
        );
    }

    return <>{element}</>;
};
