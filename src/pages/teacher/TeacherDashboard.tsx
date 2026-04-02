import React from 'react';
import { HiPlus, HiAcademicCap, HiCube, HiChartBar, HiPencil, HiExternalLink } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useGetTeacherCourses } from '@/hooks/useCourses';
import { useCurrentAccount } from '@/features/auth';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const TeacherDashboard: React.FC = () => {
    const { data: account } = useCurrentAccount();
    const { data: courses, isLoading, error } = useGetTeacherCourses(account?.$id || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e45e4]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#1e1e1e] tracking-tight mb-3">
                        Teacher <span className="text-[#4e45e4]">Dashboard</span>
                    </h1>
                    <p className="text-[#5a6065] text-lg font-medium leading-relaxed">Manage your curriculum and track student progress.</p>
                </div>
                <Button
                    variant="primary"
                    className="h-14 px-8 shadow-xl shadow-[#4e45e4]/10"
                    leftIcon={<HiPlus className="w-5 h-5" />}
                    as={Link}
                    to="/teacher/courses/new"
                >
                    Create New Course
                </Button>
            </div>

            {/* Stats Overview: High Fidelity, No Borders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                    { label: 'Total Students', value: '1,248', icon: HiAcademicCap, color: 'text-[#4e45e4]', bg: 'bg-[#4e45e4]/5' },
                    { label: 'Published Courses', value: courses?.total || 0, icon: HiCube, color: 'text-[#3d36b8]', bg: 'bg-[#3d36b8]/5' },
                    { label: 'Total Revenue', value: '$4,520', icon: HiChartBar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={stat.label} className="bg-white p-7 rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex items-center gap-6 group hover:shadow-xl hover:shadow-[#4e45e4]/5 transition-all duration-500">
                        <div className={`${stat.bg} ${stat.color} p-4.5 h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#adb3b8] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-[#1e1e1e] leading-none mb-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Courses List */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-1.5 h-8 bg-[#4e45e4] rounded-full" />
                <h2 className="text-2xl font-bold text-[#1e1e1e] tracking-tight">Active Courses</h2>
            </div>

            {error && (
                <div className="mb-8">
                    <Alert type="error" message="Failed to load your courses. Please try again later." />
                </div>
            )}

            {!courses || courses.documents.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-24 text-center shadow-[0_4px_40px_rgba(0,0,0,0.02)] border-2 border-dashed border-[#f1f4f8]">
                    <div className="bg-[#f1f4f8] p-8 h-20 w-20 rounded-full inline-flex items-center justify-center mb-8">
                        <HiPlus className="w-10 h-10 text-[#adb3b8]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1e1e1e] mb-3">Your library is empty</h3>
                    <p className="text-[#5a6065] text-lg font-medium mb-10 max-w-sm mx-auto">Start sharing your knowledge by creating your first masterclass.</p>
                    <Button
                        variant="secondary"
                        className="px-10"
                        as={Link}
                        to="/teacher/courses/new"
                    >
                        Create First Course
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {courses.documents.map((course) => (
                        <div
                            key={course.$id}
                            className="bg-white p-7 rounded-[2.5rem] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-[0,80,203,0.06] transition-all duration-500 group relative border border-transparent hover:border-[#4e45e4]/10"
                        >
                            <div className="flex flex-col sm:flex-row gap-7">
                                <div className="w-full sm:w-40 h-32 bg-[#f1f4f8] rounded-3xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500">
                                    {course.thumbnail_id ? (
                                        <img
                                            src={`https://cloud.appwrite.io/v1/storage/buckets/default/files/${course.thumbnail_id}/view?project=default`}
                                            alt={course.title}
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#adb3b8]">
                                            <HiCube className="w-14 h-14 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3">
                                        {course.is_published ? (
                                            <span className="bg-emerald-500 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-emerald-500/20">Live</span>
                                        ) : (
                                            <span className="bg-[#adb3b8] text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-slate-400/20">Draft</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-5 mb-3">
                                        <h3 className="text-xl font-bold text-[#1e1e1e] truncate group-hover:text-[#4e45e4] transition-colors leading-tight">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" as={Link} to={`/teacher/courses/${course.$id}`} className="w-9 h-9 p-0 flex items-center justify-center text-[#adb3b8] hover:text-[#4e45e4] bg-[#f1f4f8] rounded-xl">
                                                <HiPencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" as={Link} to={`/courses/${course.$id}`} target="_blank" className="w-9 h-9 p-0 flex items-center justify-center text-[#adb3b8] hover:text-[#4e45e4] bg-[#f1f4f8] rounded-xl">
                                                <HiExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-[#5a6065] line-clamp-2 mb-6 leading-relaxed">
                                        {course.description || 'No description provided.'}
                                    </p>
                                    <div className="flex items-center gap-10">
                                        <div>
                                            <p className="text-[9px] font-black text-[#adb3b8] uppercase tracking-[0.15em] mb-0.5">Students</p>
                                            <p className="text-sm font-black text-[#1e1e1e]">{course.total_students || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-[#adb3b8] uppercase tracking-[0.15em] mb-0.5">Tuition</p>
                                            <p className="text-sm font-black text-[#1e1e1e]">${course.price || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-[#adb3b8] uppercase tracking-[0.15em] mb-0.5">Rating</p>
                                            <p className="text-sm font-black text-[#4e45e4]">{course.rating || 'N/A'}</p>
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
