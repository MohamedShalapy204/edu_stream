import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test-utils';
import { CourseHero } from '../components/CourseHero';

describe('CourseHero', () => {
    const defaultProps = {
        title: 'Scholarly Catalog',
        subtitle: 'Explore our curated domain of knowledge.',
        searchQuery: '',
        onSearchChange: vi.fn(),
        categories: ['All', 'Technology', 'Design'],
        selectedCategory: 'All',
        onCategoryChange: vi.fn(),
    };

    it('should render title and subtitle', () => {
        render(<CourseHero {...defaultProps} />);

        expect(screen.getByText('Scholarly Catalog')).toBeInTheDocument();
        expect(screen.getByText('Explore our curated domain of knowledge.')).toBeInTheDocument();
    });

    it('should call onSearchChange when typing in the search bar', () => {
        const onSearchChange = vi.fn();
        render(<CourseHero {...defaultProps} onSearchChange={onSearchChange} />);
        const input = screen.getByPlaceholderText(/Identify a domain of study/i);

        fireEvent.change(input, { target: { value: 'React' } });

        expect(onSearchChange).toHaveBeenCalledWith('React');
    });

    it('should call onCategoryChange when a category is clicked', () => {
        const onCategoryChange = vi.fn();
        render(<CourseHero {...defaultProps} onCategoryChange={onCategoryChange} />);
        const designBtn = screen.getByText(/Design/i);

        fireEvent.click(designBtn);

        expect(onCategoryChange).toHaveBeenCalledWith('Design');
    });

    it('should highlight the currently selected category', () => {
        render(<CourseHero {...defaultProps} selectedCategory="Technology" />);
        const techBtn = screen.getByText(/Technology/i);

        expect(techBtn).toHaveClass('bg-primary');
        expect(screen.getByText(/Design/i)).not.toHaveClass('bg-primary');
    });
});
