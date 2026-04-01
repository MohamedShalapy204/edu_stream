import { Navigate, Outlet } from 'react-router-dom';
import { RoleGuard } from '@/features/auth';
import { UserRole } from '@/types';
import Dashboard from '@/pages/dashboard/Dashboard';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import ManageCoursePage from '@/pages/teacher/ManageCoursePage';
import { ProtectedLayoutWrapper } from './ProtectedLayoutWrapper';

export const protectedRoutes = [
    {
        path: '/',
        element: <ProtectedLayoutWrapper />,
        children: [
            { path: 'dashboard', element: <Dashboard /> },
            {
                path: 'teacher',
                element: <RoleGuard allowedRoles={[UserRole.TEACHER]}><Outlet /></RoleGuard>,
                children: [
                    { path: 'dashboard', element: <TeacherDashboard /> },
                    { path: 'courses/new', element: <ManageCoursePage /> },
                    { path: 'courses/:id', element: <ManageCoursePage /> },
                ]
            },
            {
                path: 'admin',
                element: <RoleGuard allowedRoles={[UserRole.ADMIN]}><Outlet /></RoleGuard>,
                children: [
                    { path: '', element: <div>Admin Dashboard Placeholder</div> },
                ]
            },
            { path: '*', element: <Navigate to="/dashboard" replace /> },
        ],
    },
];
