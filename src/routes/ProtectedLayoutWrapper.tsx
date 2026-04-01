import { AuthGuard } from '@/features/auth';
import MainLayout from '@/layouts/MainLayout';

export const ProtectedLayoutWrapper = () => {
    return (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    );
};
