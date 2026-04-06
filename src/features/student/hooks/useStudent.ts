import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentApi } from '../api/studentApi';
import { progressApi } from '../api/progressApi';

export const studentKeys = {
    all: ['student'] as const,
    enrollments: (userId: string) => [...studentKeys.all, 'enrollments', userId] as const,
    progress: (userId: string) => [...studentKeys.all, 'progress', userId] as const,
};

export const useGetEnrolledCourses = (userId?: string) => {
    return useQuery({
        queryKey: studentKeys.enrollments(userId!),
        queryFn: () => studentApi.getEnrolledCourses(userId!),
        enabled: !!userId,
    });
};

export const useGetStudentProgress = (userId?: string) => {
    return useQuery({
        queryKey: studentKeys.progress(userId!),
        queryFn: () => progressApi.getStudentProgress(),
        enabled: !!userId,
    });
};

export const useMarkLessonComplete = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, lessonId }: { courseId: string; lessonId: string }) =>
            progressApi.markLessonComplete(courseId, lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.progress(userId) });
        },
    });
};

export const useUpdateLastAccessed = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ courseId, lessonId }: { courseId: string; lessonId: string }) =>
            progressApi.updateLastAccessed(courseId, lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: studentKeys.progress(userId) });
        },
    });
};
