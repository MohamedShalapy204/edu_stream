import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft, HiSparkles } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import CourseForm from '@/components/courses/CourseForm';
import { useCreateCourse, useUpdateCourse, useGetCourseById } from '@/hooks/useCourses';
import { useCurrentAccount } from '@/features/auth';
import Alert from '@/components/ui/Alert';
import { type CourseInput } from '@/utils/validation';

const ManageCoursePage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: account } = useCurrentAccount();
    const { data: initialCourse, isLoading: isFetching } = useGetCourseById(id || '');

    const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
    const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

    const isEdit = !!id;

    const handleSubmit = (data: CourseInput) => {
        if (!account?.$id) return;

        if (isEdit) {
            updateCourse({ courseId: id, data }, {
                onSuccess: () => navigate('/teacher/dashboard')
            });
        } else {
            createCourse({
                ...data,
                teacher_id: account.$id,
                total_students: 0,
                rating: 0,
            }, {
                onSuccess: () => navigate('/teacher/dashboard')
            });
        }
    };

    if (isEdit && isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    leftIcon={<HiArrowLeft className="w-5 h-5" />}
                    className="text-slate-500 font-bold"
                >
                    Back to Dashboard
                </Button>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-widest">
                    <HiSparkles className="w-4 h-4" />
                    Teacher Mode
                </div>
            </div>

            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
                    {isEdit ? 'Refine your' : 'Create new'} <span className="text-blue-600">Course</span>
                </h1>
                <p className="text-slate-500 font-medium">
                    {isEdit
                        ? 'Update your course details and curriculum to keep students engaged.'
                        : 'Fill in the details below to start your journey as an instructor on EduStream.'
                    }
                </p>
            </div>

            <CourseForm
                initialData={initialCourse}
                onSubmit={handleSubmit}
                isLoading={isCreating || isUpdating}
            />
        </div>
    );
};

export default ManageCoursePage;
