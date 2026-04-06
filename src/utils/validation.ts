import { z } from 'zod';

// ── Review Schema ──

export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(5, 'Review must be at least 5 characters'),
});

// ── Inferred Types ──

export type ReviewInput = z.infer<typeof reviewSchema>;
