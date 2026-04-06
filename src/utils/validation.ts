import { z } from 'zod';

// ── Course Schemas ──

export const courseSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string(),
    price: z.number().min(0, 'Price must be positive'),
    categories: z.array(z.string()),
    is_published: z.boolean().default(false),
    thumbnail_id: z.string().optional(),
    thumbnail: z.any().optional(), // For File/FileList
});

export const sectionSchema = z.object({
    title: z.string().min(2, 'Section title is required'),
    order: z.number().int().positive(),
});

export const lessonSchema = z.object({
    title: z.string().min(2, 'Lesson title is required'),
    content_type: z.enum(['video', 'pdf', 'audio']),
    duration: z.number().min(0).optional(),
    order: z.number().int().positive(),
});

// ── Review Schema ──

export const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(5, 'Review must be at least 5 characters'),
});

// ── Inferred Types ──

export type CourseInput = z.infer<typeof courseSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
