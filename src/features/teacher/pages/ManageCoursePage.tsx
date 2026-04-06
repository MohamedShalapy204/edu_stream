import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineSparkles, HiOutlineTrash } from 'react-icons/hi2';
import { motion } from 'motion/react';
import CourseForm from '@/features/courses/components/CourseForm';
import { CurriculumEditor, type ICourse } from '@/features/courses';
import { useCreateCourse, useUpdateCourse, useGetCourseById, useDeleteCourse } from '@/features/courses';
import { useCurrentAccount } from '@/features/auth';
import type { CourseInput } from '@/features/courses/schemas/courseSchema';

/**
 * 🏛️ ManageCoursePage
 * 
 * Orchestrates the creation and refinement of course archives.
 * Features a dual-tab layout for metadata and curriculum management.
 */
const ManageCoursePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { data: account } = useCurrentAccount();

    const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');

    const { data: course, isLoading: isLoadingCourse, error: fetchError } = useGetCourseById(id || '');
    const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
    const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();
    const { mutate: deleteCourse, isPending: isDeleting } = useDeleteCourse();

    const handleSubmit = (data: CourseInput) => {
        if (isEditMode && id) {
            updateCourse(
                { courseId: id, data },
                { onSuccess: () => navigate('/teacher/dashboard') }
            );
        } else {
            // Mapping input data to the creation schema
            createCourse(
                {
                    ...data,
                    teacher_id: account?.$id || '',
                    total_students: 0,
                    rating: 0,
                },
                { onSuccess: () => navigate('/teacher/dashboard') }
            );
        }
    };

    const handleDeleteCourse = () => {
        if (window.confirm('WARNING: Are you sure you want to permanently delete this course? This action cannot be undone.')) {
            deleteCourse(id!, { onSuccess: () => navigate('/teacher/dashboard') });
        }
    };

    if (isEditMode && isLoadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-5xl mx-auto px-6 py-12"
        >
            {/* Header: Digital Atheneum style */}
            <div className="flex items-center justify-between mb-16">
                <button
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-3 text-base-content/30 hover:text-primary transition-all"
                >
                    <div className="p-2 rounded-xl group-hover:bg-primary/5 transition-colors border border-transparent group-hover:border-primary/10">
                        <HiOutlineArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Return to Dashboard</span>
                </button>

                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/10">
                    <HiOutlineSparkles className="w-4 h-4" />
                    Archive Mode
                </div>
            </div>

            <div className="mb-16 text-center sm:text-left space-y-4">
                <h1 className="text-5xl font-heading font-black text-base-content tracking-tighter leading-tight">
                    {isEditMode ? 'Refine' : 'Archive'} <span className="text-primary italic font-medium">Wisdom</span>
                </h1>
                <p className="text-base-content/50 text-lg font-medium leading-relaxed max-w-xl border-l-[3px] border-primary/10 pl-6 py-2">
                    {isEditMode
                        ? 'Update your course details and curriculum records.'
                        : 'Initiate a new domain of study for the Atheneum catalog.'}
                </p>
            </div>

            {/* Tabs */}
            {isEditMode && (
                <div className="flex items-center gap-4 mb-8 border-b border-base-content/5 pb-px">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-base-content/30 hover:text-base-content/60'}`}
                    >
                        Course Metadata
                    </button>
                    <button
                        onClick={() => setActiveTab('curriculum')}
                        className={`pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'curriculum' ? 'text-primary border-b-2 border-primary' : 'text-base-content/30 hover:text-base-content/60'}`}
                    >
                        Syllabus & Curriculum
                    </button>
                </div>
            )}

            {/* Error States */}
            {fetchError && (
                <div className="p-6 bg-error/5 text-error rounded-3xl border border-error/10 text-xs font-black uppercase tracking-[0.2em] text-center mb-10 shadow-sm">
                    Failed to synchronize course records.
                </div>
            )}

            {/* Main Form Container: Premium depth */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] shadow-premium p-8 lg:p-16 border border-white/40 ring-1 ring-base-content/5 relative overflow-hidden group mb-12">
                {/* Decorative depth accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full translate-x-24 -translate-y-24 blur-3xl opacity-50 group-hover:bg-primary/10 transition-all duration-1000" />

                <div className="relative z-10">
                    {!isEditMode || activeTab === 'details' ? (
                        <>
                            <CourseForm
                                initialData={course as unknown as ICourse}
                                onSubmit={handleSubmit}
                                isLoading={isCreating || isUpdating}
                            />

                            {/* Danger Zone */}
                            {isEditMode && (
                                <div className="mt-16 pt-8 border-t border-error/10 flex flex-col items-center sm:items-start">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-error mb-4 opacity-50">Danger Zone</h4>
                                    <button
                                        onClick={handleDeleteCourse}
                                        disabled={isDeleting}
                                        className="btn btn-outline border-error/30 text-error hover:bg-error hover:text-white hover:border-error h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all w-full sm:w-auto flex items-center gap-2"
                                    >
                                        {isDeleting ? <span className="loading loading-spinner loading-xs" /> : <HiOutlineTrash className="w-5 h-5" />}
                                        Delete Course Archive
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <CurriculumEditor courseId={id!} />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ManageCoursePage;
