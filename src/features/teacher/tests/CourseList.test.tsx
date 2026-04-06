import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils';
import { CourseList } from '../components/CourseList';
import type { ICourse } from '@/features/courses';

vi.mock('@/services/appwrite/storage/storageService', () => ({
    storageService: {
        getFilePreview: vi.fn(() => 'mock-thumb-url'),
    }
}));

describe('CourseList', () => {
    const mockCourses: ICourse[] = [
        {
            $id: 'course-1',
            title: 'Mastering AI',
            description: 'Learn everything about AI',
            price: 99.99,
            total_students: 120,
            is_published: true,
            thumbnail_id: 'thumb-1',
            categories: ['Technology'],
        } as any,
    ];

    it('should render course details correctly in the list', () => {
        render(<CourseList courses={mockCourses} />);

        expect(screen.getByText('Mastering AI')).toBeInTheDocument();
        expect(screen.getByText('Learn everything about AI')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('120')).toBeInTheDocument();
        expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });

    it('should show Draft badge for unpublished courses', () => {
        const unpublishedCourse = { ...mockCourses[0], is_published: false };
        render(<CourseList courses={[unpublishedCourse]} />);

        expect(screen.getByText(/Draft/i)).toBeInTheDocument();
        expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    });

    it('should show empty state message when no courses provided', () => {
        render(<CourseList courses={[]} />);

        expect(screen.getByText(/The archives are silent/i)).toBeInTheDocument();
        expect(screen.getByText(/Initiate New Course/i)).toBeInTheDocument();
    });

    it('should show empty state message for undefined courses', () => {
        render(<CourseList courses={undefined as any} />);

        expect(screen.getByText(/The archives are silent/i)).toBeInTheDocument();
    });
});
