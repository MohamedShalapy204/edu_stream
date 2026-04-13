import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentApi } from '../api/enrollmentApi';

export const useGetTeacherEnrollments = (courseIds: string[]) => {
    return useQuery({
        queryKey: ['teacher', 'enrollments', courseIds],
        queryFn: () => enrollmentApi.getTeacherEnrollments(courseIds),
        enabled: courseIds.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetPendingVodafoneEnrollments = (courseIds: string[]) => {
    return useQuery({
        queryKey: ['teacher', 'pending_vodafone_enrollments', courseIds],
        queryFn: () => enrollmentApi.getPendingVodafoneEnrollments(courseIds),
        enabled: courseIds.length > 0,
        // Short stale time to keep pending counts relatively fresh
        staleTime: 30 * 1000,
    });
};

export const useApproveVodafoneEnrollment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ enrollmentId, studentId, courseId }: { enrollmentId: string; studentId: string; courseId: string; }) => 
            enrollmentApi.approveVodafoneEnrollment(enrollmentId, studentId, courseId),
        onSuccess: (_, variables) => {
            // Invalidate pending queue to remove it
            queryClient.invalidateQueries({ queryKey: ['teacher', 'pending_vodafone_enrollments'] });
            // Invalidate generic enrollments since we created a new active subscription
            queryClient.invalidateQueries({ queryKey: ['teacher', 'enrollments'] });
            // Invalidate student-view specific checks
            queryClient.invalidateQueries({ queryKey: ['vodafone_enrollments', 'check', variables.courseId, variables.studentId] });
        }
    });
};

export const useDenyVodafoneEnrollment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (enrollmentId: string) => enrollmentApi.denyVodafoneEnrollment(enrollmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacher', 'pending_vodafone_enrollments'] });
        }
    });
};
