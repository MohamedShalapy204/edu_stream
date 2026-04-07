import { type FC, type ReactNode, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@/features/auth';
import { useGetCourseById } from '@/features/courses/hooks/useCourseActions';
import { useGetEnrolledCourses } from '../hooks/useStudent';

interface EnrollmentGuardProps {
    children: ReactNode;
}

/**
 * 🛡️ EnrollmentGuard (The Scholarship Proctor)
 * 
 * Verifies that the current user is either the owner of the course
 * or has an active enrollment before granting access to theater content.
 */
export const EnrollmentGuard: FC<EnrollmentGuardProps> = ({ children }) => {
    const { id: courseId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user } = useCurrentAccount();

    const { data: course, isLoading: isCourseLoading } = useGetCourseById(courseId || '');
    const { data: enrolledCourses, isLoading: isEnrollmentLoading } = useGetEnrolledCourses(user?.$id);

    const isLoading = isCourseLoading || isEnrollmentLoading;

    const hasAccess = useMemo(() => {
        if (!user || !course) return false;
        if (course.teacher_id === user.$id) return true; // Owners have bypass access
        return enrolledCourses?.some(ec => ec.course.$id === courseId);
    }, [user, course, enrolledCourses, courseId]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50">
                <span className="loading loading-spinner text-primary loading-lg" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50 flex-col gap-6">
                <div className="w-20 h-20 bg-error/5 rounded-[2.5rem] flex items-center justify-center text-error/30 mb-2">
                    <span className="text-4xl font-black">?</span>
                </div>
                <h1 className="text-3xl font-heading font-black tracking-tight">Course Not Found</h1>
                <button onClick={() => navigate('/student/dashboard')} className="btn btn-primary rounded-full px-8">Return Home</button>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="fixed inset-0 bg-base-100 flex items-center justify-center z-50 flex-col gap-6 p-6 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary/30 mb-2">
                    <span className="text-4xl font-black">!</span>
                </div>
                <div className="max-w-sm">
                    <h1 className="text-3xl font-heading font-black tracking-tight mb-2">Access Required</h1>
                    <p className="text-base-content/40 text-sm font-medium leading-relaxed">
                        You must be enrolled in this course to enter the auditorium and access the curriculum content.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate(`/courses/${courseId}`)} className="btn btn-primary rounded-full px-8 shadow-xl">Enroll Now</button>
                    <button onClick={() => navigate('/student/dashboard')} className="btn btn-ghost rounded-full px-8">Dashboard</button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
