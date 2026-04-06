import { type ICourse } from '@/features/courses';
import { type ISubscription } from '@/types';

export interface IEnrolledCourse {
    subscription: ISubscription;
    course: ICourse;
}

export interface ICourseProgress {
    completed_lessons: string[]; // List of lesson IDs the user has completed
    last_accessed_lesson?: string; // ID of the last viewed lesson to resume
}

// Full schema expected within the user's Appwrite Preferences
export interface IStudentPreferences {
    progress?: Record<string, ICourseProgress>; // Keyed by course_id
}
