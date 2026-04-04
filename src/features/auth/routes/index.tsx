import { GuestGuard } from '../components/AuthGuard';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';

export const authRoutes = [
    {
        path: '/login',
        element: (
            <GuestGuard>
                <Login />
            </GuestGuard>
        ),
    },
    {
        path: '/register',
        element: (
            <GuestGuard>
                <Register />
            </GuestGuard>
        ),
    },
    {
        path: '/verify-email',
        element: <VerifyEmail />,
    },
];
