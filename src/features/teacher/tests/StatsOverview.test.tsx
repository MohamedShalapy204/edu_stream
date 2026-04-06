import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test-utils';
import { StatsOverview } from '../components/StatsOverview';

describe('StatsOverview', () => {
    const mockStats = [
        { id: 'learners', label: 'Enrolled Learners', value: '150' },
        { id: 'courses', label: 'Archived Courses', value: 2 },
        { id: 'revenue', label: 'Scholarly Revenue', value: '$7,498.5' },
    ];

    it('should render all stat labels and values correctly', () => {
        render(<StatsOverview stats={mockStats} />);

        // Check labels (labels are in uppercase tracking-[0.25em] in component, but screen.getByText handles it)
        expect(screen.getByText(/Enrolled Learners/i)).toBeInTheDocument();
        expect(screen.getByText(/Archived Courses/i)).toBeInTheDocument();
        expect(screen.getByText(/Scholarly Revenue/i)).toBeInTheDocument();

        // Check values
        expect(screen.getByText('150')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('$7,498.5')).toBeInTheDocument();
    });

    it('should render icons corresponding to stat IDs', () => {
        const { container } = render(<StatsOverview stats={mockStats} />);
        
        // Check if there are 3 icons based on the structure (HiAcademicCap, HiCube, HiChartBar)
        // Since they are from react-icons, they are svg elements
        const svgs = container.querySelectorAll('svg');
        expect(svgs.length).toBe(3);
    });
});
