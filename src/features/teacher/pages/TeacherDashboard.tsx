import React from 'react';
import { HiPlus } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGetTeacherCourses, type ICourse } from '@/features/courses';
import { useCurrentAccount } from '@/features/auth';
import { StatsOverview } from '../components/StatsOverview';
import { CourseList } from '../components/CourseList';
import { EnrollmentLedger } from '../components/EnrollmentLedger';
import { useTeacherStats } from '../hooks/useTeacherStats';

/**
 * 🏛️ TeacherDashboard (Domain Page)
 * 
 * The primary administrative nexus for instructors.
 * Assembles high-fidelity features from the teacher slice.
 */
const TeacherDashboard: React.FC = () => {
    const { data: account } = useCurrentAccount();
    const { data: courses, isLoading, error } = useGetTeacherCourses(account?.$id || '');

    // Compute scholarly metrics from the synchronized records
    const stats = useTeacherStats(courses?.documents as unknown as ICourse[]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-base-content/40 font-black text-xs uppercase tracking-[0.2em]">Synchronizing Records...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-7xl mx-auto px-6 lg:px-12 py-12 selection:bg-primary/20"
        >
            {/* ── Scholarly Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-primary text-[9px] uppercase font-black tracking-[0.2em] ring-1 ring-primary/10">
                        Faculty Portal
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-heading font-black text-base-content tracking-tighter leading-tight text-balance">
                        Teacher <span className="text-primary italic font-medium italic-serif">Dashboard</span>
                    </h1>
                    <p className="text-base-content/50 text-base font-medium leading-relaxed max-w-md border-l-2 border-primary/10 pl-5">
                        Manage your curriculum and track scholarly achievement within the Atheneum.
                    </p>
                </div>
                <Link
                    to="/teacher/courses/new"
                    className="group relative inline-flex items-center justify-center h-16 px-10 bg-primary text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-4xl shadow-xl shadow-primary/20 hover:shadow-2xl transition-all active:scale-[0.98] ring-1 ring-white/20"
                >
                    <HiPlus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    Archive New Wisdom
                </Link>
            </div>

            {/* ── Performance Ledger (Stats) ── */}
            <div className="mb-20">
                <StatsOverview stats={stats} />
            </div>

            {/* ── Curriculum Catalog (Course List) ── */}
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-primary/20 rounded-full" />
                    <h2 className="text-2xl font-heading font-black text-base-content uppercase tracking-tight">Active Curriculum</h2>
                </div>

                {error && (
                    <div className="p-10 bg-error/5 text-error rounded-3xl border border-error/10 text-xs font-black uppercase tracking-widest text-center">
                        Failed to synchronize curriculum records.
                    </div>
                )}

                <CourseList courses={courses?.documents as unknown as ICourse[]} />
            </div>

            {/* ── Scholarly Roster (Enrollments) ── */}
            <div className="mt-20 mb-10">
                <EnrollmentLedger courses={(courses?.documents as unknown as ICourse[]) || []} />
            </div>
        </motion.div>
    );
};

export default TeacherDashboard;
