import { type FC } from 'react';
import { motion } from 'motion/react';
import { useCurrentAccount } from '@/features/auth';
import { HiOutlineAcademicCap, HiOutlineBolt } from 'react-icons/hi2';
import { useGetEnrolledCourses, useGetStudentProgress } from '../hooks/useStudent';
import { EnrolledCourseCard } from '../components/EnrolledCourseCard';

const StudentDashboard: FC = () => {
    const { data: user } = useCurrentAccount();
    const { data: enrolledCourses, isLoading } = useGetEnrolledCourses(user?.$id);
    const { data: allProgress } = useGetStudentProgress(user?.$id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-4xl md:text-5xl font-heading font-black text-base-content tracking-tight mb-4 flex items-center gap-4">
                        Learning Portal
                        <div className="bg-primary/10 p-2 rounded-2xl">
                            <HiOutlineAcademicCap className="w-8 h-8 text-primary" />
                        </div>
                    </h1>
                    <p className="text-base-content/40 text-lg font-medium max-w-2xl leading-relaxed">
                        Welcome back, <span className="text-base-content/80">{user?.name}</span>. Access your active scholarly pursuits and continue your cognitive expansion.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <span className="loading loading-spinner text-primary loading-lg" />
                </div>
            ) : enrolledCourses && enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {enrolledCourses.map((enrolled) => (
                        <EnrolledCourseCard
                            key={enrolled.subscription.$id}
                            enrolledCourse={enrolled}
                            progress={allProgress?.[enrolled.course.$id]}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-20 text-center shadow-premium border border-dashed border-base-content/10 ring-1 ring-base-content/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl opacity-50 group-hover:bg-primary/10 transition-all duration-1000" />
                    <div className="bg-primary/5 p-10 h-24 w-24 rounded-4xl inline-flex items-center justify-center mb-8 text-primary/30 relative z-10 glass">
                        <HiOutlineBolt className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-heading font-black text-base-content mb-4 tracking-tight relative z-10">No Active Enrollments</h3>
                    <p className="text-base-content/40 text-lg font-medium mb-12 max-w-sm mx-auto relative z-10 leading-relaxed">
                        It appears your academic transcript is currently empty. Explore the course catalog to begin your journey.
                    </p>
                    <a
                        href="/courses"
                        className="relative z-10 inline-flex items-center px-10 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 rounded-2xl transition-all duration-300"
                    >
                        Browse Curriculums
                    </a>
                </div>
            )}
        </motion.div>
    );
};

export default StudentDashboard;
