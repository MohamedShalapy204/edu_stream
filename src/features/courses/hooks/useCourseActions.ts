import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { queryKeys } from '@/keys/queryKeys';
import { courseApi } from '../api/courseApi';
import type { ICourse } from '../types/courseTypes';

/**
 * 🪝 useCourseActions
 * 
 * A consolidated hook providing all necessary React Query actions 
 * for the Courses feature, from listing to mutation.
 */
export function useGetCourses(queries: string[] = []) {
    return useQuery({
        queryKey: queryKeys.courses.list({ queries }),
        queryFn: () => courseApi.listCourses([...queries, Query.equal('is_published', true)]),
    });
}

export function useGetCourseById(courseId: string) {
    return useQuery({
        queryKey: queryKeys.courses.detail(courseId),
        queryFn: () => courseApi.getCourse(courseId),
        enabled: !!courseId,
    });
}

export function useGetTeacherCourses(teacherId: string) {
    return useQuery({
        queryKey: queryKeys.courses.byTeacher(teacherId),
        queryFn: () => courseApi.listCourses([Query.equal('teacher_id', teacherId)]),
        enabled: !!teacherId,
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<ICourse, '$id' | '$createdAt' | '$updatedAt'>) =>
            courseApi.createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        },
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: Partial<ICourse> }) =>
            courseApi.updateCourse(courseId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(variables.courseId) });
        },
    });
}

export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => courseApi.deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        },
    });
}
