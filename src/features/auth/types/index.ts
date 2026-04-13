export * from '@/types/user';

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

