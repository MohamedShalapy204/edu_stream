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

// ── Inferred Types ──

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
