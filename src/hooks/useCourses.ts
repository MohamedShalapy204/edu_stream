import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from 'appwrite';
import { queryKeys } from '../keys/queryKeys';
import { courseService } from '../services/appwrite/databases/courseService';
import type { ICourse } from '../types';

/**
 * Hook to fetch all published courses.
 */
export function useGetCourses(queries: string[] = []) {
    return useQuery({
        queryKey: queryKeys.courses.list({ queries }),
        queryFn: () => courseService.listCourses([...queries, Query.equal('is_published', true)]),
    });
}

/**
 * Hook to fetch courses owned by a specific teacher.
 */
export function useGetTeacherCourses(teacherId: string) {
    return useQuery({
        queryKey: queryKeys.courses.byTeacher(teacherId),
        queryFn: () => courseService.listTeacherCourses(teacherId),
        enabled: !!teacherId,
    });
}

/**
 * Hook to fetch a single course by ID.
 */
export function useGetCourseById(courseId: string) {
    return useQuery({
        queryKey: queryKeys.courses.detail(courseId),
        queryFn: () => courseService.getCourse(courseId),
        enabled: !!courseId,
    });
}

/**
 * Hook to create a new course.
 */
export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<ICourse, '$id' | '$createdAt' | '$updatedAt'>) =>
            courseService.createCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        },
    });
}

/**
 * Hook to update an existing course.
 */
export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, data }: { courseId: string; data: Partial<ICourse> }) =>
            courseService.updateCourse(courseId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.detail(variables.courseId) });
        },
    });
}

/**
 * Hook to delete a course.
 */
export function useDeleteCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (courseId: string) => courseService.deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        },
    });
}
