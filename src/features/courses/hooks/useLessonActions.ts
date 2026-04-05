import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { lessonApi } from '../api/lessonApi';
import type { ILesson } from '../types/courseTypes';
import type { IAppwriteDoc } from '@/types';

export const LESSON_KEYS = {
    all: ['lessons'] as const,
    bySection: (sectionId: string) => [...LESSON_KEYS.all, { sectionId }] as const,
};

export const useGetSectionLessons = (sectionId: string) => {
    return useQuery({
        queryKey: LESSON_KEYS.bySection(sectionId),
        queryFn: () => lessonApi.getSectionLessons(sectionId),
        enabled: Boolean(sectionId),
    });
};

export const useCreateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<ILesson, keyof IAppwriteDoc>) => lessonApi.createLesson(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: LESSON_KEYS.bySection(variables.section_id) });
        },
    });
};

export const useUpdateLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ lessonId, data }: { lessonId: string; data: Partial<ILesson> }) =>
            lessonApi.updateLesson(lessonId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
        },
    });
};

export const useDeleteLesson = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (lessonId: string) => lessonApi.deleteLesson(lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: LESSON_KEYS.all });
        },
    });
};
