import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
// 🕊️ Using relative path temporarily to troubleshoot module resolution
import type { ICourse } from '../../courses';

/**
 * 📊 useTeacherStats
 * 
 * Aggregates statistics from a teacher's course collection.
 */
export const useTeacherStats = (courses: ICourse[] = []) => {
    const { t } = useTranslation();
    return useMemo(() => {
        const totalCourses = courses.length;
        const totalLearners = courses.reduce((acc, course) => acc + (course.total_students || 0), 0);
        const totalRevenue = totalLearners * 49.99;

        return [
            { id: 'learners', label: t('teacher.stats.learners'), value: totalLearners.toLocaleString() },
            { id: 'courses', label: t('teacher.stats.courses'), value: totalCourses },
            { id: 'revenue', label: t('teacher.stats.revenue'), value: `$${totalRevenue.toLocaleString()}` },
        ];
    }, [courses]);
};
