import { useMemo } from 'react';
// 🕊️ Using relative path temporarily to troubleshoot module resolution
import type { ICourse } from '../../courses';

/**
 * 📊 useTeacherStats
 * 
 * Aggregates statistics from a teacher's course collection.
 */
export const useTeacherStats = (courses: ICourse[] = []) => {
    return useMemo(() => {
        const totalCourses = courses.length;
        const totalLearners = courses.reduce((acc, course) => acc + (course.total_students || 0), 0);
        const totalRevenue = totalLearners * 49.99;

        return [
            { id: 'learners', label: 'Enrolled Learners', value: totalLearners.toLocaleString() },
            { id: 'courses', label: 'Archived Courses', value: totalCourses },
            { id: 'revenue', label: 'Scholarly Revenue', value: `$${totalRevenue.toLocaleString()}` },
        ];
    }, [courses]);
};
