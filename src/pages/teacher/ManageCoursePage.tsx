import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import CourseForm from '@/components/courses/CourseForm';
import { useCreateCourse, useUpdateCourse, useGetCourseById } from '@/hooks/useCourses';
import { useCurrentAccount } from '@/features/auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
                { courseId: id, data },
                { onSuccess: () => navigate('/teacher/dashboard') }
            );
        } else {
            createCourse(
                {
                    ...data,
                    teacher_id: account?.$id || '',
                    total_students: 0,
                    rating: 0,
                } as any,
                { onSuccess: () => navigate('/teacher/dashboard') }
            );
        }
    };

    if (isEditMode && isLoadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
                    className="text-muted-foreground font-bold hover:text-primary transition-colors gap-2"
                >
                    <HiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Back to Dashboard
                </Button>

                <div className="flex items-center gap-2 bg-surface-100 text-primary px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-colors border border-primary/5">
                    <HiSparkles className="w-4 h-4" />
                    Teacher Mode
                </div>
            </div>

            <div className="mb-10 text-center lg:text-left">
                <h1 className="text-4xl font-extrabold text-foreground tracking-tighter mb-3">
                    {isEditMode ? 'Edit' : 'Create'} <span className="text-primary italic">Course</span>
                </h1>
                <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                    {isEditMode
                        ? 'Update your course details and curriculum.'
                        : 'Share your knowledge with the world by creating a new course.'}
                </p>
            </div>

            {/* Error States */}
            {(fetchError) && (
                <Alert
                    variant="destructive"
                    className="mb-8 rounded-3xl border-none shadow-sm bg-destructive/5"
                >
                    <AlertDescription className="font-bold text-sm tracking-tight">Failed to load course details. Please try again.</AlertDescription>
                </Alert>
            )}

            {/* Main Form Container: Premium depth, using shadcn primitives indirectly through CourseForm */}
            <div className="bg-white dark:bg-surface-900 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.03)] p-8 lg:p-12 overflow-hidden relative group transition-colors duration-500">
                {/* Decorative depth accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-surface-50 rounded-full translate-x-16 -translate-y-16 opacity-50 group-hover:bg-primary/5 transition-colors duration-1000" />

                <div className="relative z-10">
                    <CourseForm
                        initialData={course as any}
                        onSubmit={handleSubmit}
                        isLoading={isCreating || isUpdating}
                    />
                </div>
            </div>
        </div>
    );
};

export default ManageCoursePage;
