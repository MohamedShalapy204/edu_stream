import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import CourseForm from '@/components/courses/CourseForm';
import { useCreateCourse, useUpdateCourse, useGetCourseById } from '@/hooks/useCourses';
import { useCurrentAccount } from '@/features/auth';
import Alert from '@/components/ui/Alert';
import { type CourseInput } from '@/utils/validation';

const ManageCoursePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);
    const { data: account } = useCurrentAccount();

    const { data: course, isLoading: isLoadingCourse, error: fetchError } = useGetCourseById(id || '');
    const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
    const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

    const handleSubmit = (data: CourseInput) => {
        if (isEditMode && id) {
            updateCourse(
                { id, data },
                { onSuccess: () => navigate('/teacher/dashboard') }
            );
        } else {
            createCourse(
                {
                    ...data,
                    teacher_id: account?.$id || '',
                    total_students: 0,
                    rating: 0,
                } as any, // Fixed by previous NewDoc logic, but let's assume NewDoc is back
                { onSuccess: () => navigate('/teacher/dashboard') }
            );
        }
    };

    if (isEditMode && isLoadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4e45e4]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Header: Digital Atheneum style */}
            <div className="flex items-center justify-between mb-10">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    leftIcon={<HiArrowLeft className="w-5 h-5" />}
                    className="text-[#adb3b8] font-bold hover:text-[#4e45e4] transition-colors"
                >
                    Back to Dashboard
                </Button>

                <div className="flex items-center gap-2 bg-[#f1f4f8] text-[#4e45e4] px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em]">
                    <HiSparkles className="w-4 h-4" />
                    Teacher Mode
                </div>
            </div>

            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-extrabold text-[#1e1e1e] tracking-tight mb-3">
                    {isEditMode ? 'Edit' : 'Create'} <span className="text-[#4e45e4]">Course</span>
                </h1>
                <p className="text-[#5a6065] text-lg font-medium">
                    {isEditMode
                        ? 'Update your course details and curriculum.'
                        : 'Share your knowledge with the world by creating a new course.'}
                </p>
            </div>

            {/* Error States */}
            {(fetchError) && (
                <Alert
                    type="error"
                    message="Failed to load course details. Please try again."
                    className="mb-8"
                />
            )}

            {/* Main Form Container: Premium depth, no borders */}
            <div className="bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-8 lg:p-12 overflow-hidden relative group">
                {/* Decorative depth accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#f1f4f8] rounded-full translate-x-16 -translate-y-16 opacity-50 group-hover:bg-[#e0e7ff] transition-colors duration-700" />

                <div className="relative z-10">
                    <CourseForm
                        initialData={course as any}
                        onSubmit={handleSubmit}
                        isLoading={isCreating || isUpdating}
                        isEditMode={isEditMode}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManageCoursePage;
