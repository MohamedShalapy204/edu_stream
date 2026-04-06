import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@/test-utils';
import { useGetCourses, useGetCourseById, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourseActions';
import { courseApi } from '../api/courseApi';
import { Query } from 'appwrite';

vi.mock('../api/courseApi');

describe('useCourseActions hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const mockCourse = {
        $id: 'course-1',
        title: 'Mastering AI',
        price: 99.99,
        is_published: true,
    };

    describe('useGetCourses', () => {
        it('should call courseApi.listCourses with published filter', async () => {
            vi.mocked(courseApi.listCourses).mockResolvedValue({ total: 1, documents: [mockCourse] } as any);

            const { result } = renderHook(() => useGetCourses());

            // Initial wait for the query to execute
            await act(async () => {
                await result.current.refetch();
            });

            expect(courseApi.listCourses).toHaveBeenCalledWith(
                expect.arrayContaining([expect.stringContaining('is_published')])
            );
        });
    });

    describe('useGetCourseById', () => {
        it('should call courseApi.getCourse when rendered with courseId', async () => {
            vi.mocked(courseApi.getCourse).mockResolvedValue(mockCourse as any);

            const { result } = renderHook(() => useGetCourseById('course-1'));

            await act(async () => {
                await result.current.refetch();
            });

            expect(courseApi.getCourse).toHaveBeenCalledWith('course-1');
        });
    });

    describe('useCreateCourse', () => {
        it('should call courseApi.createCourse with correct data', async () => {
            const courseInput = { title: 'New Course', price: 0, instructor_id: 'inst-1', is_published: true };
            vi.mocked(courseApi.createCourse).mockResolvedValue({ ...mockCourse, ...courseInput } as any);

            const { result } = renderHook(() => useCreateCourse());

            await act(async () => {
                await result.current.mutateAsync({ data: courseInput as any });
            });

            expect(courseApi.createCourse).toHaveBeenCalledWith(courseInput, undefined);
        });
    });

    describe('useUpdateCourse', () => {
        it('should call courseApi.updateCourse with updated data', async () => {
            const updateInput = { title: 'Better Course' };
            vi.mocked(courseApi.updateCourse).mockResolvedValue({ ...mockCourse, ...updateInput } as any);

            const { result } = renderHook(() => useUpdateCourse());

            await act(async () => {
                await result.current.mutateAsync({ courseId: 'course-1', data: updateInput });
            });

            expect(courseApi.updateCourse).toHaveBeenCalledWith('course-1', updateInput, undefined);
        });
    });

    describe('useDeleteCourse', () => {
        it('should call courseApi.deleteCourse', async () => {
            vi.mocked(courseApi.deleteCourse).mockResolvedValue({} as any);

            const { result } = renderHook(() => useDeleteCourse());

            await act(async () => {
                await result.current.mutateAsync('course-1');
            });

            expect(courseApi.deleteCourse).toHaveBeenCalledWith('course-1');
        });
    });
});
