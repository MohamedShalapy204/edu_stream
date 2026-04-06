import React from 'react';
import type { ILesson } from '../types/courseTypes';
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

    const hasVideoUrl = !!lesson.video_url;
    const documentIds = lesson.document_ids || [];
    const hasAttachments = documentIds.length > 0;

    if (!hasVideoUrl && !hasAttachments) {
        return (
            <div className="w-full aspect-video rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <AlertCircle size={48} strokeWidth={1.5} className="mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-slate-700">Content Unavailable</h3>
                <p className="text-sm max-w-xs mt-1">
                    The content for this lesson is either missing or incorrectly configured.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* ── Render: External Video (YouTube/Vimeo) ── */}
            {hasVideoUrl && (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    {getYouTubeId(lesson.video_url!) ? (
                        <iframe
                            src={`https://www.youtube.com/embed/${getYouTubeId(lesson.video_url!)}?rel=0&modestbranding=1&showinfo=0`}
                            title={lesson.title}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : getVimeoId(lesson.video_url!) ? (
                        <iframe
                            src={`https://player.vimeo.com/video/${getVimeoId(lesson.video_url!)}?badge=0&autopause=0&player_id=0&app_id=58479`}
                            title={lesson.title}
                            className="absolute inset-0 w-full h-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm font-black uppercase tracking-widest">
                            Unrecognized Video Format
                        </div>
                    )}
                </div>
            )}

            {/* ── Render: Internal Storage (Appwrite) Documents Array ── */}
            {hasAttachments && (
                <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-base-content/50 px-2">Lesson Resources</h3>

                    {documentIds.length === 1 ? (
                        /* Single Document - Render direct iframe preview */
                        <div className="w-full aspect-3/4 sm:aspect-square bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 overflow-hidden shadow-sm flex flex-col">
                            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-blue-600" />
                                    <span className="font-bold text-slate-800 text-sm">{lesson.title} - Associated Document</span>
                                </div>
                                <a
                                    href={storageService.getFileView(documentIds[0]).toString()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                                >
                                    Open in New Tab
                                </a>
                            </div>
                            <iframe
                                src={`${storageService.getFileView(documentIds[0]).toString()}#toolbar=0`}
                                className="w-full h-full border-0"
                            />
                        </div>
                    ) : (
                        /* Multiple Documents - Render styled grid of download cards */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {documentIds.map((docId, index) => (
                                <a
                                    key={docId}
                                    href={storageService.getFileView(docId).toString()}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-4 p-4 rounded-2xl border border-base-content/10 bg-white hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-1 transition-all group shadow-sm hover:shadow-md cursor-pointer"
                                >
                                    <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText size={24} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col justify-center h-full">
                                        <span className="text-sm font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">
                                            Resource File {index + 1}
                                        </span>
                                        <span className="text-xs font-medium text-base-content/40 mt-0.5">Click to view or download</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
