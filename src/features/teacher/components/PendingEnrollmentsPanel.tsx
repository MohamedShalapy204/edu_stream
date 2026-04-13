import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineClock } from 'react-icons/hi2';
import { useGetPendingVodafoneEnrollments } from '../hooks/useEnrollments';
import type { ICourse } from '@/features/courses';

interface PendingEnrollmentsPanelProps {
    courses: ICourse[];
}

export const PendingEnrollmentsPanel: React.FC<PendingEnrollmentsPanelProps> = ({ courses }) => {
    const courseIds = courses.map(c => c.$id);
    const { data: pendingEnrollments, isLoading } = useGetPendingVodafoneEnrollments(courseIds);

    if (isLoading) return null;

    const totalPending = pendingEnrollments?.length || 0;

    if (totalPending === 0) return null;

    // Group by course to show summaries
    const pendingByCourse = pendingEnrollments?.reduce((acc, curr) => {
        acc[curr.course_id] = (acc[curr.course_id] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    return (
        <div className="bg-warning/10 border border-warning/20 rounded-4xl p-8 mb-16 animate-in slide-in-from-top-4 duration-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm text-warning relative">
                        <HiOutlineClock className="w-8 h-8" />
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-warning text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                            {totalPending}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight text-warning-content">Pending Confirmations</h3>
                        <p className="text-sm font-medium opacity-70">
                            {totalPending} student{totalPending > 1 ? 's' : ''} {totalPending > 1 ? 'have' : 'has'} submitted Vodafone Cash receipts awaiting your audit.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {Object.entries(pendingByCourse).map(([courseId, count]) => {
                        const course = courses.find(c => c.$id === courseId);
                        if (!course) return null;
                        return (
                            <Link
                                key={courseId}
                                to={`/teacher/courses/${courseId}`}
                                className="px-4 py-2 bg-white/50 hover:bg-white text-warning-content rounded-xl text-[10px] font-black uppercase tracking-widest border border-warning/10 flex items-center gap-2 transition-all active:scale-95"
                            >
                                {course.title}
                                <span className="bg-warning text-white px-1.5 py-0.5 rounded-md text-[8px]">{count}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
