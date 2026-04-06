import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test-utils';
import { CourseCard } from '../components/CourseCard';

vi.mock('@/services/appwrite/storage/storageService', () => ({
    storageService: {
        getFilePreview: vi.fn(() => 'mock-thumb-url'),
    }
}));

describe('CourseCard', () => {
    const mockCourse = {
        $id: 'course-1',
        title: 'Mastering AI',
        description: 'Learn everything about AI',
        price: 99.99,
        total_students: 120,
        is_published: true,
        thumbnail_id: 'thumb-1',
        categories: ['Technology'],
    } as any;

    it('should render course details correctly', () => {
        render(<CourseCard course={mockCourse} />);

        expect(screen.getByText('Mastering AI')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('120 Learners')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', '/courses/course-1');
    });

    it('should show COMPLIMENTARY badge for free courses', () => {
        const freeCourse = { ...mockCourse, price: 0 };
        render(<CourseCard course={freeCourse} />);

        expect(screen.getByText(/COMPLIMENTARY/i)).toBeInTheDocument();
    });

    it('should show fallback text for missing descriptions', () => {
        const minimalCourse = { ...mockCourse, description: '' };
        render(<CourseCard course={minimalCourse} />);

        expect(screen.getByText(/curated domain of knowledge/i)).toBeInTheDocument();
    });
});
