import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../keys/queryKeys';
import { sectionService } from '../services/appwrite/databases/sectionService';
import type { ISection } from '../types';

/**
 * Hook to fetch all sections for a course.
 */
export function useGetSections(courseId: string) {
    return useQuery({
        queryKey: queryKeys.sections.byCourse(courseId),
        queryFn: () => sectionService.listCourseSections(courseId),
        enabled: !!courseId,
    });
}

/**
 * Hook to create a new section.
 */
export function useCreateSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Omit<ISection, '$id' | '$createdAt' | '$updatedAt'>) =>
            sectionService.createSection(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sections.byCourse(variables.course_id) });
        },
    });
}

/**
 * Hook to update a section.
 */
export function useUpdateSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ sectionId, data }: { sectionId: string; data: Partial<ISection> }) =>
            sectionService.updateSection(sectionId, data),
        onSuccess: (updatedSection) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sections.byCourse(updatedSection.course_id) });
        },
    });
}

/**
 * Hook to delete a section.
 */
export function useDeleteSection(courseId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sectionId: string) => sectionService.deleteSection(sectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.sections.byCourse(courseId) });
        },
    });
}
