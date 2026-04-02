import { Route, Routes, Navigate } from 'react-router-dom';
import { GuestGuard } from '../components/AuthGuard';
import Login from './Login';
import Register from './Register';
import VerifyEmail from './VerifyEmail';

export const AuthRoutes = () => {
    return (
        <Routes>
            <Route
                path="login"
                element={
                    <GuestGuard>
                        <Login />
                    </GuestGuard>
                }
            />
            <Route
                path="register"
                element={
                    <GuestGuard>
                        <Register />
                    </GuestGuard>
                }
            />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};
