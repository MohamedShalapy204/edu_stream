// ── Constants ──

import { UserRole } from '@/features/auth';
export { UserRole };


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

// ── Shared Course Entities ──
export * from '@/features/courses/types/courseTypes';

// ── Interfaces ──

// moved to @/features/auth/types


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
