import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@/test-utils';
import CourseForm from '../components/CourseForm';
import userEvent from '@testing-library/user-event';

describe('CourseForm', () => {
    const defaultProps = {
        onSubmit: vi.fn(),
        isLoading: false,
    };

    it('should render the first step (Course Info)', () => {
        render(<CourseForm {...defaultProps} />);

        expect(screen.getByLabelText(/Masterclass Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tuition/i)).toBeInTheDocument();
    });

    it('should show validation errors for empty fields on advance attempt', async () => {
        render(<CourseForm {...defaultProps} />);
        const user = userEvent.setup();

        // Advance button (Step 1 -> 2)
        const advanceBtn = screen.getByText(/Advance/i);
        await user.click(advanceBtn);

        // Validation errors (Zod schema title.min(5))
        await waitFor(() => {
            expect(screen.getByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
        });
    });

    it('should navigate through all 3 steps', async () => {
        render(<CourseForm {...defaultProps} />);
        const user = userEvent.setup();

        // Step 1
        await user.type(screen.getByLabelText(/Masterclass Title/i), 'Advanced React Patterns');
        await user.type(screen.getByLabelText(/Tuition/i), '199');
        await user.click(screen.getByText(/Advance/i));

        // Step 2
        expect(screen.getByText(/Curriculum Builder/i)).toBeInTheDocument();
        await user.click(screen.getByText(/Advance/i));

        // Step 3
        expect(screen.getByText(/Course Visuals/i)).toBeInTheDocument();
        expect(screen.getByText(/Launch Masterclass/i)).toBeInTheDocument();
    });

    it('should call onSubmit with complete data on the final step', async () => {
        const onSubmit = vi.fn();
        render(<CourseForm {...defaultProps} onSubmit={onSubmit} />);
        const user = userEvent.setup();

        // Step 1
        await user.type(screen.getByLabelText(/Masterclass Title/i), 'Solid Course Title');
        await user.type(screen.getByLabelText(/Tuition/i), '49.99');
        await user.click(screen.getByText(/Advance/i));

        // Step 2
        await user.click(screen.getByRole('button', { name: /Advance/i }));

        // Step 3
        const submitBtn = screen.getByRole('button', { name: /Launch Masterclass/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Solid Course Title',
                price: 49.99,
            }));
        });
    });
});
