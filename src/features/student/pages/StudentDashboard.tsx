import { type FC, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useCurrentAccount } from '@/features/auth';
import { HiOutlineAcademicCap, HiOutlineBolt, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi2';
import { useGetEnrolledCourses, useGetStudentProgress } from '../hooks/useStudent';
import { useStudentVodafoneEnrollments } from '@/features/payment/hooks/useVodafoneEnrollment';
import { EnrolledCourseCard } from '../components/EnrolledCourseCard';
import { useGetCourses } from '@/features/courses/hooks/useCourseActions';
import { type ICourse } from '@/features/courses';
import { type IVodafoneEnrollment } from '@/features/payment/types';
import { type ISubscription } from '@/types';

interface DashboardItem {
    subscription: ISubscription | null;
    course: ICourse;
    vodafoneEnrollment?: IVodafoneEnrollment;
}

const StudentDashboard: FC = () => {
    const { data: user } = useCurrentAccount();
    const { data: enrolledCourses, isLoading: isEnrolledLoading } = useGetEnrolledCourses(user?.$id);
    const { data: vodafoneEnrollments, isLoading: isVodafoneLoading } = useStudentVodafoneEnrollments(user?.$id || '');
    const { data: allProgress } = useGetStudentProgress(user?.$id);
    const { data: coursesData } = useGetCourses();

    const isLoading = isEnrolledLoading || isVodafoneLoading;

    // 🧠 Cognitive Merge: Combine active subscriptions with pending/denied Vodafone records
    const dashboardItems = useMemo<DashboardItem[]>(() => {
        const results: DashboardItem[] = [];
        const enrolled = enrolledCourses || [];
        const vodafone = vodafoneEnrollments || [];

        // 1. Process active enrollments
        enrolled.forEach(ec => {
            results.push({
                subscription: ec.subscription,
                course: ec.course,
                vodafoneEnrollment: vodafone.find(ve => ve.course_id === ec.course.$id)
            });
        });

        // 2. Process pending/denied records that aren't active yet
        vodafone.forEach(ve => {
            const isActive = enrolled.some(ec => ec.course.$id === ve.course_id);
            if (!isActive) {
                const course = coursesData?.documents.find(c => c.$id === ve.course_id);
                if (course) {
                    results.push({
                        subscription: null,
                        course: course as ICourse,
                        vodafoneEnrollment: ve
                    });
                }
            }
        });

        return results;
    }, [enrolledCourses, vodafoneEnrollments, coursesData]);

    // Derived stats for the summary bar
    const totalEnrolled = dashboardItems.filter(i => !!i.subscription).length;
    const totalCompleted = Object.values(allProgress || {}).reduce(
        (acc, p) => acc + (p.completed_lessons?.length || 0), 0
    );
    const pendingCount = dashboardItems.filter(i => i.vodafoneEnrollment?.status === 'pending').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full py-10 md:py-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-heading font-black text-base-content tracking-tight mb-3 md:mb-4 flex items-center gap-3 md:gap-4">
                        Learning Portal
                        <div className="bg-primary/10 p-2 rounded-xl md:rounded-2xl">
                            <HiOutlineAcademicCap className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                        </div>
                    </h1>
                    <p className="text-base-content/40 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                        Welcome back, <span className="text-primary font-bold">{user?.name}</span>. Access your active scholarly pursuits and continue your cognitive expansion.
                    </p>
                </div>
            </div>

            {/* Colorized stats summary stripe */}
            {!isLoading && (totalEnrolled > 0 || totalCompleted > 0) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-4 mb-12 p-6 md:p-8 rounded-4xl md:rounded-[3rem] bg-white/50 backdrop-blur-xl ring-1 ring-primary/8 shadow-card"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl md:rounded-2xl bg-primary/8 flex items-center justify-center shrink-0">
                            <HiOutlineAcademicCap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-xl md:text-2xl font-heading font-black text-primary">{totalEnrolled}</div>
                            <div className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-base-content/30">Active Courses</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl md:rounded-2xl bg-accent/8 flex items-center justify-center shrink-0">
                            <HiOutlineCheckCircle className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <div className="text-xl md:text-2xl font-heading font-black text-accent">{totalCompleted}</div>
                            <div className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-base-content/30">Lessons Done</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${pendingCount > 0 ? 'bg-warning/10' : 'bg-base-200'}`}>
                            <HiOutlineClock className={`w-5 h-5 ${pendingCount > 0 ? 'text-warning' : 'text-base-content/20'}`} />
                        </div>
                        <div>
                            <div className={`text-xl md:text-2xl font-heading font-black ${pendingCount > 0 ? 'text-warning' : 'text-base-content/30'}`}>{pendingCount}</div>
                            <div className="text-[8px] md:text-[9px] uppercase font-black tracking-widest text-base-content/30">Pending Review</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center py-32">
                    <span className="loading loading-spinner text-primary loading-lg" />
                </div>
            ) : dashboardItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {dashboardItems.map((item) => (
                        <EnrolledCourseCard
                            key={item.subscription?.$id || item.vodafoneEnrollment?.$id}
                            enrolledCourse={item}
                            progress={allProgress?.[item.course.$id]}
                            vodafoneEnrollment={item.vodafoneEnrollment}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-20 text-center shadow-premium border border-dashed border-primary/10 ring-1 ring-primary/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl opacity-50 group-hover:bg-primary/10 transition-all duration-1000" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full translate-x-24 translate-y-24 blur-2xl opacity-50" />
                    <div className="bg-primary/5 p-10 h-24 w-24 rounded-4xl inline-flex items-center justify-center mb-8 text-primary/40 relative z-10">
                        <HiOutlineBolt className="w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-heading font-black text-base-content mb-4 tracking-tight relative z-10">No Active Enrollments</h3>
                    <p className="text-base-content/40 text-lg font-medium mb-12 max-w-sm mx-auto relative z-10 leading-relaxed">
                        It appears your academic transcript is currently empty. Explore the course catalog to begin your journey.
                    </p>
                    <Link
                        to="/courses"
                        viewTransition
                        className="relative z-10 inline-flex items-center px-10 py-4 bg-primary text-primary-content font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 rounded-2xl transition-all duration-300"
                    >
                        Browse Curriculums
                    </Link>
                </div>
            )}
        </motion.div>
    );
};

export default StudentDashboard;
