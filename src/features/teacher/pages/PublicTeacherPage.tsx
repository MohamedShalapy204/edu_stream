import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { HiOutlineArrowLeft, HiOutlineAcademicCap } from 'react-icons/hi2';
import { useUser } from '@/hooks/useUser';
import { useGetPublicTeacherCourses } from '@/features/courses/hooks/useCourseActions';
import { CourseGrid } from '@/features/courses/components/CourseGrid';

const PublicTeacherPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: teacher, isLoading: isTeacherLoading } = useUser(id || '');
    const { data: coursesData, isLoading: isCoursesLoading } = useGetPublicTeacherCourses(id || '');
    const courses = coursesData?.documents || [];

    if (isTeacherLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                <h1 className="text-4xl font-black mb-4">Instructor Not Found</h1>
                <p className="text-base-content/50">The scholarly profile you are looking for does not exist.</p>
                <button onClick={() => navigate('/courses')} className="btn btn-primary mt-8">Browse Catalog</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto px-6 lg:px-12 py-12"
        >
            <button
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-3 text-base-content/40 hover:text-primary transition-all mb-12"
            >
                <div className="p-2 rounded-xl group-hover:bg-primary/5 transition-colors border border-transparent group-hover:border-primary/10">
                    <HiOutlineArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Back</span>
            </button>

            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] p-10 lg:p-16 border border-white/40 shadow-sm ring-1 ring-base-content/5 flex flex-col md:flex-row items-center md:items-start gap-10 mb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-24 -translate-y-24 blur-3xl opacity-50" />

                <div className="avatar z-10">
                    <div className="w-40 h-40 rounded-[2.5rem] bg-primary/10 border-4 border-white shadow-xl text-primary flex items-center justify-center font-black text-6xl">
                        {teacher.avatar_url ? (
                            <img src={teacher.avatar_url} alt={teacher.name} className="object-cover rounded-[2.2rem]" />
                        ) : teacher.name.charAt(0).toUpperCase()}
                    </div>
                </div>

                <div className="text-center md:text-left z-10 flex-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/10 mb-4">
                        <HiOutlineAcademicCap className="w-4 h-4" />
                        Distinguished Faculty
                    </div>
                    <h1 className="text-5xl font-heading font-black text-base-content tracking-tighter mb-4">{teacher.name}</h1>
                    <p className="text-base-content/60 text-lg font-medium leading-relaxed max-w-2xl">
                        {teacher.bio || 'This instructor is a dedicated academic scholar within the Atheneum.'}
                    </p>
                </div>
            </div>

            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-primary/20 rounded-full" />
                    <h2 className="text-3xl font-heading font-black text-base-content uppercase tracking-tight">Curated Archives</h2>
                </div>

                {isCoursesLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <span className="loading loading-spinner text-primary loading-lg" />
                    </div>
                ) : courses.length > 0 ? (
                    <CourseGrid courses={courses as unknown as import('@/features/courses/types/courseTypes').ICourse[]} isLoading={false} />
                ) : (
                    <div className="bg-surface-50 p-12 rounded-3xl text-center border border-white/40 shadow-sm">
                        <h3 className="text-xl font-bold mb-2 text-base-content">No Published Archives</h3>
                        <p className="text-base-content/50 font-medium">This instructor has not published any courses yet.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default PublicTeacherPage;
