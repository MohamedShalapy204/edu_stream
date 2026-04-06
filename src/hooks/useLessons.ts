import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../keys/queryKeys';
import { lessonService } from '../services/appwrite/databases/lessonService';
import type { ILesson } from '../types';

/**
 * Hook to fetch all lessons for a section.
 */
export function useGetLessons(sectionId: string) {
    return useQuery({
        queryKey: queryKeys.lessons.bySection(sectionId),
        queryFn: () => lessonService.listSectionLessons(sectionId),
        enabled: !!sectionId,
    });
}

/**
 * Hook to fetch all lessons for an entire course.
 */
export function useGetLessonsByCourse(courseId: string) {
    return useQuery({
        queryKey: ['lessons', 'course', courseId],
        queryFn: () => lessonService.listCourseLessons(courseId),
        enabled: !!courseId,
    });
}

/**
 * Hook to fetch a single lesson.
 */
export function useGetLessonById(lessonId: string) {
    return useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: () => lessonService.getLesson(lessonId),
        enabled: !!lessonId,
    });
}

/**
 * Hook to create a new lesson.
 */
export function useCreateLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<ILesson, '$id' | '$createdAt' | '$updatedAt'>) =>
            lessonService.createLesson(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.bySection(variables.section_id) });
        },
    });
}

/**
 * Hook to update a lesson.
 */
export function useUpdateLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lessonId, data }: { lessonId: string; data: Partial<ILesson> }) =>
            lessonService.updateLesson(lessonId, data),
        onSuccess: (updatedLesson) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.bySection(updatedLesson.section_id) });
            queryClient.invalidateQueries({ queryKey: ['lesson', updatedLesson.$id] });
        },
    });
}

/**
 * Hook to delete a lesson.
 */
export function useDeleteLesson(sectionId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: string) => lessonService.deleteLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.bySection(sectionId) });
        },
    });
}
