import type { IAppwriteDoc } from './index';

export const UserRole = {
    STUDENT: 'student',
    TEACHER: 'teacher',
    ADMIN: 'admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUser extends IAppwriteDoc {
    name: string;
    email: string;
    role: UserRole;
    avatar_url?: string;
    bio?: string;
    vodafone_cash_number?: string | null;
}
