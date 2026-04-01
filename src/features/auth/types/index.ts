import type { IAppwriteDoc } from '@/types';

export const UserRole = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

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
    labels: string[];
    prefs: Record<string, unknown>;
}

export interface IUser extends IAppwriteDoc {
    name: string;
    email: string;
    role: UserRole;
    avatar_url?: string;
    bio?: string;
}
