import { z } from 'zod';

// ── Auth Schemas ──

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

// For Service Level (Account Creation)
export const accountSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

// For UI Level (Registration Form)
export const registerSchema = accountSchema
    .extend({
        confirmPassword: z.string(),
        role: z.enum(['student', 'teacher', 'admin']),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

// ── Course Schemas ──

export const courseSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string(),
    price: z.number().min(0, 'Price must be positive'),
    categories: z.array(z.string()),
    is_published: z.boolean(),
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

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type SectionInput = z.infer<typeof sectionSchema>;
export type LessonInput = z.infer<typeof lessonSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
