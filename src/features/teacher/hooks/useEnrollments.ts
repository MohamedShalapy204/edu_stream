import { useQuery } from '@tanstack/react-query';
import { enrollmentApi } from '../api/enrollmentApi';

export const useGetTeacherEnrollments = (courseIds: string[]) => {
    return useQuery({
        queryKey: ['teacher', 'enrollments', courseIds],
        queryFn: () => enrollmentApi.getTeacherEnrollments(courseIds),
        enabled: courseIds.length > 0,
        staleTime: 5 * 60 * 1000,
    });
};
