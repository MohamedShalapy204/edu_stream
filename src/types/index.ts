// ── Constants ──

export const UserRole = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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

// ── Interfaces ──

export interface IAccount {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    email: string;
    emailVerification: boolean;
    phone: string;
    phoneVerification: boolean;
    status: boolean;
    prefs: Record<string, unknown>;
}

export interface IUser {
    $id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar_url?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ICourse {
    $id: string;
    title: string;
    description?: string;
    price: number;
    teacher_id: string;
    thumbnail_url?: string;
    is_published: boolean;
    categories?: string[];
    rating?: number;
    total_students?: number;
    created_at: Date;
    updated_at: Date;
}

export interface ISection {
    $id: string;
    course_id: string;
    title: string;
    order?: number;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ILesson {
    $id: string;
    section_id: string;
    title: string;
    content_type: ContentType;
    file_url: string;
    duration?: number;
    order?: number;
    description?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ISubscription {
    $id: string;
    user_id: string;
    course_id: string;
    status: SubscriptionStatus;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
    stripeSubscriptionId?: string;
}

export interface IPayment {
    $id: string;
    user_id: string;
    course_id: string;
    amount: number;
    currency: string;
    payment_status: PaymentStatus;
    stripe_payment_id: string;
    created_at: Date;
    updated_at: Date;
}

export interface IReview {
    $id: string;
    user_id: string;
    course_id: string;
    rating: number;
    comment: string;
    created_at: Date;
    updated_at: Date;
}

export interface INotification {
    $id: string;
    user_id: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface IContentAccess {
    $id: string;
    user_id: string;
    course_id: string;
    device_id: string;
    last_access_time?: Date;
    device_name: string;
    device_type: DeviceType;
    ip_address?: string;
    created_at: Date;
    updated_at: Date;
}
