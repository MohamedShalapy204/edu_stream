import type { IAppwriteDoc } from '@/types';

export const ContentType = {
    VIDEO: 'video',
    PDF: 'pdf',
    POWERPOINT: 'powerpoint',
    WORD: 'word',
    ZIP: 'zip',
    AUDIO: 'audio',
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];


export interface ICourse extends IAppwriteDoc {
    title: string;
    description: string;
    thumbnail_id?: string;
    teacher_id: string;
    price: number;
    is_published: boolean;
    categories: string[];
    total_students?: number;
    rating?: number;
    duration?: number;
    language?: string;
}

export interface ICategory {
    id: string;
    name: string;
    slug: string;
}

export interface ISection extends IAppwriteDoc {
    course_id: string;
    title: string;
    order?: number;
    description?: string;
}

export interface ILesson extends IAppwriteDoc {
    section_id: string;
    course_id?: string;
    title: string;
    content_type?: ContentType;
    video_url?: string;
    video_id?: string;
    file_id?: string;
    duration?: number;
    order: number;
    description?: string;
    is_free?: boolean;
}

