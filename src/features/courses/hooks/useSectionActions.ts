import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sectionApi } from '../api/sectionApi';
import type { ISection } from '../types/courseTypes';
import type { IAppwriteDoc } from '@/types';

export const SECTION_KEYS = {
    all: ['sections'] as const,
    byCourse: (courseId: string) => [...SECTION_KEYS.all, { courseId }] as const,
};

export const useGetCourseSections = (courseId: string) => {
    return useQuery({
        queryKey: SECTION_KEYS.byCourse(courseId),
        queryFn: () => sectionApi.getCourseSections(courseId),
        enabled: Boolean(courseId),
    });
};

export const useCreateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<ISection, keyof IAppwriteDoc>) => sectionApi.createSection(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: SECTION_KEYS.byCourse(variables.course_id) });
        },
    });
};

export const useUpdateSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ sectionId, data }: { sectionId: string; data: Partial<ISection> }) =>
            sectionApi.updateSection(sectionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SECTION_KEYS.all });
        },
    });
};

export const useDeleteSection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sectionId: string) => sectionApi.deleteSection(sectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: SECTION_KEYS.all });
        },
    });
};
