import { Outlet } from 'react-router-dom';
import NotFound from '@/pages/errors/NotFound';
import { RoleGuard, UserRole } from '@/features/auth';
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
                // TODO: Add admin routes
                children: [
                    { path: '', element: <div>Admin Dashboard Placeholder</div> },
                ]
            },
            { path: '*', element: <NotFound /> },
        ],
    },
];
