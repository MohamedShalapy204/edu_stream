// ── Constants ──

import { UserRole } from '@/features/auth';
export { UserRole };

export const ContentType = {
    VIDEO: 'video',
    PDF: 'pdf',
    POWERPOINT: 'powerpoint',
    WORD: 'word',
    ZIP: 'zip',
    AUDIO: 'audio',
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const SubscriptionStatus = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    REVOKED: 'revoked',
    CANCELED: 'canceled',
} as const;
export type SubscriptionStatus =
    (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const PaymentStatus = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
} as const;
export type PaymentStatus =
    (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const DeviceType = {
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
    TABLET: 'tablet',
} as const;
export type DeviceType =
    (typeof DeviceType)[keyof typeof DeviceType];

// ── Base Interface ──

export interface IAppwriteDoc {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $sequence: number;
}

// ── Interfaces ──

// moved to @/features/auth/types

export interface ICourse extends IAppwriteDoc {
    title: string;
    description?: string;
    price: number;
    teacher_id: string;
    thumbnail_id?: string; // Appwrite Storage ID
    is_published: boolean;
    categories?: string[];
    rating?: number;
    total_students?: number;
    duration?: number;
}

export interface ISection extends IAppwriteDoc {
    course_id: string;
    title: string;
    order?: number;
    description?: string;
}

export interface ILesson extends IAppwriteDoc {
    section_id: string;
    title: string;
    content_type: ContentType;
    video_url?: string; // For YouTube/Vimeo embeds (Free Plan friendly)
    file_id?: string;   // For Appwrite Storage (PDFs, small assets)
    duration?: number;  // in seconds
    order?: number;
    description?: string;
}

export interface ISubscription extends IAppwriteDoc {
    user_id: string;
    course_id: string;
    status: SubscriptionStatus;
    start_date: string;
    end_date: string;
    stripe_subscription_id?: string;
}

export interface IPayment extends IAppwriteDoc {
    user_id: string;
    course_id: string;
    amount: number;
    currency: string;
    payment_status: PaymentStatus;
    stripe_payment_id: string;
}

export interface IReview extends IAppwriteDoc {
    user_id: string;
    course_id: string;
    rating: number; // 1-5
    comment: string;
}

export interface INotification extends IAppwriteDoc {
    user_id: string;
    title: string;
    message: string;
    is_read: boolean;
}

export interface IContentAccess extends IAppwriteDoc {
    user_id: string;
    course_id: string;
    device_id: string;
    device_name: string;
    device_type: DeviceType;
    last_access_time?: string;
    ip_address?: string;
}
