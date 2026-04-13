import { z } from 'zod';

export const vodafoneNumberSchema = z
    .string()
    .regex(/^010\d{8}$/, 'Must be a valid Vodafone Egypt number (starts with 010, 11 digits total)');

export const paymentSettingsSchema = z.object({
    vodafone_cash_number: vodafoneNumberSchema,
    save_as_default: z.boolean().default(false),
});

export const coursePaymentSchema = z.object({
    vodafone_cash_number: vodafoneNumberSchema,
    allow_resubmission: z.boolean().default(false),
});
