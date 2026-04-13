import type { IAppwriteDoc } from '@/types';
import type { IUser } from '@/features/auth/types';
import type { ICourse } from '@/features/courses/types/courseTypes';

export const VodafoneEnrollmentStatus = {
    PENDING: 'pending',
    APPROVED: 'approved',
    DENIED: 'denied',
} as const;

export type VodafoneEnrollmentStatus =
    (typeof VodafoneEnrollmentStatus)[keyof typeof VodafoneEnrollmentStatus];

export interface IVodafoneEnrollment extends IAppwriteDoc {
    student_id: string;
    course_id: string;
    status: VodafoneEnrollmentStatus;
    payment_number_shown: string;
    receipt_image_id: string;
    receipt_image_url: string;
}

// Enriched view used in UI (joined with user/course data)
export interface IVodafoneEnrollmentView {
    enrollment: IVodafoneEnrollment;
    student: IUser;
    course?: ICourse; // Included in global pending list view
}
