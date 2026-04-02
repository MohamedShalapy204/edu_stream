import React from 'react';
import { HiPlus, HiAcademicCap, HiCube, HiChartBar, HiOutlinePencil, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useGetTeacherCourses } from '@/hooks/useCourses';
import { useCurrentAccount } from '@/features/auth';

const TeacherDashboard: React.FC = () => {
    const { data: account } = useCurrentAccount();
    const { data: courses, isLoading, error } = useGetTeacherCourses(account?.$id || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 selection:bg-primary/20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                    <h1 className="text-4xl font-extrabold text-foreground tracking-tighter mb-3">
                        Teacher <span className="text-primary italic">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed">Manage your curriculum and track student progress.</p>
                </div>
                <Link
                    to="/teacher/courses/new"
                    className="btn btn-primary h-14 px-8 shadow-xl shadow-primary/10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transform hover:scale-[1.02] transition-all hover:shadow-primary/20 no-animation border-none"
                >
                    <HiPlus className="w-5 h-5 mr-2" />
                    Create New Course
                </Link>
            </div>

            {/* Stats Overview: High Fidelity, No Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                {[
                    { label: 'Total Students', value: '1,248', icon: HiAcademicCap, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Published Courses', value: courses?.total || 0, icon: HiCube, color: 'text-[#3d36b8]', bg: 'bg-[#3d36b8]/10' },
                    { label: 'Total Revenue', value: '$4,520', icon: HiChartBar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-surface-900 p-7 rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-6 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 ring-1 ring-background/5 border border-transparent">
                        <div className={`${stat.bg} ${stat.color} p-4.5 h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-foreground leading-none mb-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Courses List */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                <h2 className="text-2xl font-bold text-foreground tracking-tight">Active Courses</h2>
            </div>

            {error && (
                <div className="alert alert-error mb-8 rounded-2xl border-none bg-error/10 text-error flex items-center gap-3">
                    <span className="font-bold text-sm tracking-tight text-error">Failed to load your courses. Please try again later.</span>
                </div>
            )}

            {!courses || courses.documents.length === 0 ? (
                <div className="bg-white dark:bg-surface-900 rounded-[3rem] p-24 text-center shadow-[0_4px_40px_rgba(0,0,0,0.02)] border-2 border-dashed border-muted transition-colors">
                    <div className="bg-muted p-8 h-20 w-20 rounded-full inline-flex items-center justify-center mb-8">
                        <HiPlus className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight italic">Your library is empty.</h3>
                    <p className="text-muted-foreground text-lg font-medium mb-10 max-w-sm mx-auto">Start sharing your knowledge by creating your first masterclass.</p>
                    <Link
                        to="/teacher/courses/new"
                        className="btn btn-ghost h-14 px-10 rounded-[2rem] bg-surface-50 text-foreground font-black text-xs uppercase tracking-widest hover:bg-surface-100 shadow-sm no-animation"
                    >
                        Create First Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {courses.documents.map((course) => (
                        <div
                            key={course.$id}
                            className="bg-white dark:bg-surface-900 p-7 rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-[0,80,203,0.06] transition-all duration-500 group relative border border-transparent hover:border-primary/5"
                        >
                            <div className="flex flex-col sm:flex-row gap-7">
                                <div className="w-full sm:w-40 h-32 bg-muted rounded-3xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                                    {course.thumbnail_id ? (
                                        <img
                                            src={`https://cloud.appwrite.io/v1/storage/buckets/default/files/${course.thumbnail_id}/view?project=default`}
                                            alt={course.title}
                                            className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <HiCube className="w-14 h-14 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        {course.is_published ? (
                                            <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">Live</span>
                                        ) : (
                                            <span className="bg-muted-foreground text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-slate-400/20">Draft</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-5 mb-3">
                                        <h3 className="text-xl font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight italic tracking-tight">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/teacher/courses/${course.$id}`}
                                                className="btn btn-ghost w-9 h-9 p-0 flex items-center justify-center text-muted-foreground hover:text-primary bg-muted/30 rounded-xl min-h-0"
                                            >
                                                <HiOutlinePencil className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                to={`/courses/${course.$id}`}
                                                target="_blank"
                                                className="btn btn-ghost w-9 h-9 p-0 flex items-center justify-center text-muted-foreground hover:text-primary bg-muted/30 rounded-xl min-h-0"
                                            >
                                                <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-6 leading-relaxed">
                                        {course.description || 'No description provided.'}
                                    </p>
                                    <div className="flex items-center gap-10">
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Learners</p>
                                            <p className="text-sm font-black text-foreground">{course.total_students || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Price</p>
                                            <p className="text-sm font-black text-foreground">${course.price || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Rating</p>
                                            <p className="text-sm font-black text-primary">{course.rating || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
