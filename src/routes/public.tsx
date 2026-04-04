import Home from '@/pages/Home';
import CoursesPage from '@/pages/courses/CoursesPage';
import CourseDetailPage from '@/pages/courses/CourseDetailPage';
import Unauthorized from '@/pages/errors/Unauthorized';
import NotFound from '@/pages/errors/NotFound';
import { PublicLayoutWrapper } from './PublicLayoutWrapper';

export const publicRoutes = [
    {
        element: <PublicLayoutWrapper />,
        children: [
            { path: '/', element: <Home /> },
            { path: '/courses', element: <CoursesPage /> },
            { path: '/courses/:id', element: <CourseDetailPage /> },
            { path: '/unauthorized', element: <Unauthorized /> },
            { path: '*', element: <NotFound /> },
        ],
    },
];
