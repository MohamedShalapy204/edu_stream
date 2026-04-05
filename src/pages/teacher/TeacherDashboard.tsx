import React from 'react';
import { HiPlus, HiAcademicCap, HiCube, HiChartBar, HiOutlinePencil, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useGetTeacherCourses } from '@/features/courses';
import { useCurrentAccount } from '@/features/auth';
import { storageService } from '@/services/appwrite/storage/storageService';

const TeacherDashboard: React.FC = () => {
    const { data: account } = useCurrentAccount();
    const { data: courses, isLoading, error } = useGetTeacherCourses(account?.$id || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
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
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/5 text-primary text-[9px] uppercase font-black tracking-[0.2em] ring-1 ring-primary/10">
                        Faculty Portal
                    </div>
                    <h1 className="text-5xl font-heading font-black text-base-content tracking-tighter leading-tight">
                        Teacher <span className="text-primary italic font-medium">Dashboard</span>
                    </h1>
                    <p className="text-base-content/50 text-base font-medium leading-relaxed max-w-md border-l-2 border-primary/10 pl-4">
                        Manage your curriculum and track scholarly achievement within the Atheneum.
                    </p>
                </div>
                <Link
                    to="/teacher/courses/new"
                    className="group relative inline-flex items-center justify-center h-16 px-10 bg-primary text-white font-black text-[10px] uppercase tracking-[0.25em] rounded-[2rem] shadow-xl shadow-primary/20 hover:shadow-2xl transition-all active:scale-[0.98] ring-1 ring-white/20"
                >
                    <HiPlus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    Archive New Wisdom
                </Link>
            </div>

            {/* Stats Overview: Premium Scholarly Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
                {[
                    { label: 'Enrolled Learners', value: '1,248', icon: HiAcademicCap, color: 'text-primary', bg: 'bg-primary/5' },
                    { label: 'Archived Courses', value: courses?.total || 0, icon: HiCube, color: 'text-secondary', bg: 'bg-secondary/5' },
                    { label: 'Scholarly Revenue', value: '$4,520', icon: HiChartBar, color: 'text-success', bg: 'bg-success/5' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-white/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-premium flex items-center gap-6 group hover:shadow-xl transition-all duration-500 ring-1 ring-base-content/5"
                    >
                        <div className={`${stat.bg} ${stat.color} p-5 h-16 w-16 rounded-[1.25rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm border border-white/40`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-base-content/30 uppercase tracking-[0.25em] mb-1.5">{stat.label}</p>
                            <p className="text-3xl font-heading font-black text-base-content tracking-tighter leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Courses List Section */}
            <div className="flex items-center gap-4 mb-10">
                <div className="w-1.5 h-10 bg-primary/20 rounded-full" />
                <h2 className="text-2xl font-heading font-black text-base-content tracking-tight uppercase tracking-[0.05em]">Active Curriculum</h2>
            </div>

            {error && (
                <div className="p-6 bg-error/5 text-error rounded-2xl border border-error/10 text-xs font-black uppercase tracking-widest text-center mb-10">
                    Failed to synchronize curriculum records.
                </div>
            )}

            {!courses || courses.documents.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-32 text-center shadow-premium border border-dashed border-base-content/10 transition-all">
                    <div className="bg-primary/5 p-10 h-24 w-24 rounded-[3rem] inline-flex items-center justify-center mb-8 text-primary/30">
                        <HiPlus className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-heading font-black text-base-content mb-3 tracking-tight italic">The archives are silent.</h3>
                    <p className="text-base-content/40 text-base font-medium mb-12 max-w-xs mx-auto leading-relaxed">Your intellectual contributions are awaiting their first chapter.</p>
                    <Link
                        to="/teacher/courses/new"
                        className="inline-flex items-center px-10 py-4 bg-white text-base-content font-black text-[10px] uppercase tracking-widest hover:bg-base-100 shadow-premium rounded-2xl transition-all active:scale-95 border border-base-content/5"
                    >
                        Initiate New Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {courses.documents.map((course) => (
                        <div
                            key={course.$id}
                            className="bg-white/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all duration-500 group relative border border-transparent hover:border-primary/10 ring-1 ring-base-content/5"
                        >
                            <div className="flex flex-col sm:flex-row gap-8">
                                <div className="w-full sm:w-44 h-36 bg-base-200/50 rounded-[2rem] overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 shadow-inner border border-white/40">
                                    {course.thumbnail_id ? (
                                        <img
                                            src={storageService.getFilePreview(course.thumbnail_id)}
                                            alt={course.title}
                                            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-base-content/10">
                                            <HiCube className="w-16 h-16" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        {course.is_published ? (
                                            <span className="bg-success text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-success/20 ring-1 ring-white/20">Active</span>
                                        ) : (
                                            <span className="bg-base-content/40 text-black text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg ring-1 ring-white/20">Draft</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <div className="flex items-start justify-between gap-5 mb-4">
                                        <h3 className="text-2xl font-heading font-black text-base-content truncate group-hover:text-primary transition-colors leading-tight tracking-tight">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/teacher/courses/${course.$id}`}
                                                className="w-10 h-10 flex items-center justify-center text-base-content/20 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-base-content/5"
                                            >
                                                <HiOutlinePencil className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                to={`/courses/${course.$id}`}
                                                target="_blank"
                                                className="w-10 h-10 flex items-center justify-center text-base-content/20 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-base-content/5"
                                            >
                                                <HiOutlineArrowTopRightOnSquare className="w-5 h-5" />
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-base-content/40 line-clamp-2 mb-8 leading-relaxed">
                                        {course.description || 'Access a curated domain of knowledge through this specialized scholarly study.'}
                                    </p>
                                    <div className="mt-auto flex items-center gap-8 justify-between border-t border-base-content/5 pt-6">
                                        <div>
                                            <p className="text-[8px] font-black text-base-content/30 uppercase tracking-[0.2em] mb-1">Learners</p>
                                            <p className="text-sm font-black text-base-content/80 group-hover:text-primary transition-colors">{course.total_students || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-base-content/30 uppercase tracking-[0.2em] mb-1">Acquisition</p>
                                            <p className="text-sm font-black text-base-content/80">${course.price || 0}</p>
                                        </div>
                                        <div className="px-3 py-1 rounded-lg bg-amber-400/5 border border-amber-400/10">
                                            <p className="text-[8px] font-black text-amber-600/40 uppercase tracking-[0.2em] mb-1 text-center">Mastery</p>
                                            <p className="text-sm font-black text-amber-600/80 text-center">{course.rating || '4.8'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default TeacherDashboard;
