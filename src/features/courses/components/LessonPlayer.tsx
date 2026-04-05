import React from 'react';
import type { ILesson } from '../types/courseTypes';
import { ContentType } from '../types/courseTypes';
import { storageService } from '@/services/appwrite/storage/storageService';
import { AlertCircle, FileText } from 'lucide-react';

interface LessonPlayerProps {
    lesson: ILesson;
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson }) => {
    // ── Helper: Extract Video ID for Embeds ──
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const getVimeoId = (url: string) => {
        const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
        return match ? match[1] : null;
    };

    // ── Render: External Video (YouTube/Vimeo) ──
    if (lesson.video_url) {
        const ytId = getYouTubeId(lesson.video_url);
        if (ytId) {
            return (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&showinfo=0`}
                        title={lesson.title}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }

        const vimeoId = getVimeoId(lesson.video_url);
        if (vimeoId) {
            return (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                        title={lesson.title}
                        className="absolute inset-0 w-full h-full border-0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
    }

    // ── Render: Internal Storage (Appwrite) ──
    if (lesson.file_id) {
        const fileViewUrl = storageService.getFileView(lesson.file_id).toString();

        if (lesson.content_type === ContentType.VIDEO) {
            return (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <video
                        controls
                        className="w-full h-full"
                        poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                    >
                        <source src={fileViewUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        if (lesson.content_type === ContentType.PDF) {
            return (
                <div className="w-full aspect-3/4 sm:aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FileText size={18} className="text-blue-600" />
                            <span className="font-bold text-slate-800 text-sm">{lesson.title} (PDF)</span>
                        </div>
                        <a
                            href={fileViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                        >
                            Open in New Tab
                        </a>
                    </div>
                    <iframe
                        src={`${fileViewUrl}#toolbar=0`}
                        className="w-full h-full border-0"
                    />
                </div>
            );
        }
    }

    // ── Fallback: Empty or Error ──
    return (
        <div className="w-full aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <AlertCircle size={48} strokeWidth={1.5} className="mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-slate-700">Content Unavailable</h3>
            <p className="text-sm max-w-xs mt-1">
                The content for this lesson is either missing or incorrectly configured.
            </p>
        </div>
    );
};
