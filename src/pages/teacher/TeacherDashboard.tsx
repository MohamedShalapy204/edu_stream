import React from 'react';
import { HiPlus, HiAcademicCap, HiCube, HiChartBar, HiPencil, HiExternalLink } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useGetTeacherCourses } from '../../hooks/useCourses';
import { useCurrentAccount } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const TeacherDashboard: React.FC = () => {
    const { data: account } = useCurrentAccount();
    const { data: courses, isLoading, error } = useGetTeacherCourses(account?.$id || '');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
                        Teacher <span className="text-blue-600">Dashboard</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Manage your curriculum and track student progress.</p>
                </div>
                <Button
                    variant="primary"
                    className="h-12 px-6 shadow-lg shadow-blue-500/20"
                    leftIcon={<HiPlus className="w-5 h-5" />}
                    as={Link}
                    to="/teacher/courses/new"
                >
                    Create New Course
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { label: 'Total Students', value: '1,248', icon: HiAcademicCap, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Published Courses', value: courses?.total || 0, icon: HiCube, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Total Revenue', value: '$4,520', icon: HiChartBar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Courses List */}
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <HiCube className="text-blue-600" />
                My Courses
            </h2>

            {error && (
                <Alert type="error" message="Failed to load your courses. Please try again later." className="mb-6" />
            )}

            {!courses || courses.documents.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 p-20 text-center">
                    <div className="bg-slate-50 p-6 rounded-full inline-block mb-6">
                        <HiPlus className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start sharing your knowledge! Create your first course to begin teaching.</p>
                    <Button
                        variant="secondary"
                        as={Link}
                        to="/teacher/courses/new"
                    >
                        Create First Course
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {courses.documents.map((course) => (
                        <div
                            key={course.$id}
                            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group"
                        >
                            <div className="flex gap-6">
                                <div className="w-32 h-24 bg-slate-100 rounded-2xl flex-shrink-0 overflow-hidden relative">
                                    {course.thumbnail_id ? (
                                        <img
                                            src={`https://cloud.appwrite.io/v1/storage/buckets/default/files/${course.thumbnail_id}/view?project=default`}
                                            alt={course.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <HiCube className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        {course.is_published ? (
                                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Live</span>
                                        ) : (
                                            <span className="bg-slate-400 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Draft</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" as={Link} to={`/teacher/courses/${course.$id}`} className="p-2 h-auto text-slate-400 hover:text-blue-600 bg-slate-50">
                                                <HiPencil className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" as={Link} to={`/courses/${course.$id}`} target="_blank" className="p-2 h-auto text-slate-400 hover:text-blue-600 bg-slate-50">
                                                <HiExternalLink className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">
                                        {course.description || 'No description provided.'}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students</p>
                                            <p className="text-sm font-extrabold text-slate-900">{course.total_students || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                                            <p className="text-sm font-extrabold text-slate-900">${course.price}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                                            <p className="text-sm font-extrabold text-indigo-600">{course.rating || 'N/A'}</p>
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
