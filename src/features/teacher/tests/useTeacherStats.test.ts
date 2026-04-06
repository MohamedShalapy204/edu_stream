import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useTeacherStats } from '../hooks/useTeacherStats';
import type { ICourse } from '@/features/courses';

describe('useTeacherStats', () => {
    const mockCourses: ICourse[] = [
        {
            $id: '1',
            title: 'Course 1',
            total_students: 100,
            price: 50,
            is_published: true,
            categories: [],
        } as any,
        {
            $id: '2',
            title: 'Course 2',
            total_students: 50,
            price: 100,
            is_published: true,
            categories: [],
        } as any,
    ];

    it('should calculate stats correctly for a given set of courses', () => {
        const { result } = renderHook(() => useTeacherStats(mockCourses));

        const learnersStat = result.current.find(s => s.id === 'learners');
        const coursesStat = result.current.find(s => s.id === 'courses');
        const revenueStat = result.current.find(s => s.id === 'revenue');

        expect(learnersStat?.value).toBe('150');
        expect(coursesStat?.value).toBe(2);
        // Revenue is currently totalLearners * 49.99 in the hook logic
        expect(revenueStat?.value).toBe(`$${(150 * 49.99).toLocaleString()}`);
    });

    it('should return zeroed stats for empty courses array', () => {
        const { result } = renderHook(() => useTeacherStats([]));

        const learnersStat = result.current.find(s => s.id === 'learners');
        const coursesStat = result.current.find(s => s.id === 'courses');
        const revenueStat = result.current.find(s => s.id === 'revenue');

        expect(learnersStat?.value).toBe('0');
        expect(coursesStat?.value).toBe(0);
        expect(revenueStat?.value).toBe('$0');
    });
});
