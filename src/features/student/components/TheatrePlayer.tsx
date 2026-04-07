import { type FC, useMemo } from 'react';
import type { ILesson } from '@/features/courses';
import { storageService } from '@/services/appwrite/storage/storageService';
import { HiOutlineCheckCircle, HiOutlineVideoCameraSlash } from 'react-icons/hi2';

interface TheatrePlayerProps {
    lesson: ILesson;
    isCompleted: boolean;
    onMarkCompleted: () => void;
    onNextLesson?: () => void;
}

export const TheatrePlayer: FC<TheatrePlayerProps> = ({
    lesson,
    isCompleted,
    onMarkCompleted,
    onNextLesson
}) => {
    const embedInfo = useMemo(() => {
        const url = lesson.video_url || '';
        if (url.includes('youtube.com/watch?v=')) {
            const id = url.split('v=')[1].split('&')[0];
            return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` };
        }
        if (url.includes('youtu.be/')) {
            const id = url.split('be/')[1].split('?')[0];
            return { type: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}` };
        }
        if (url.includes('vimeo.com/')) {
            const id = url.split('vimeo.com/')[1].split('?')[0];
            return { type: 'vimeo', src: `https://player.vimeo.com/video/${id}` };
        }
        return null;
    }, [lesson.video_url]);

    const hasVideo = Boolean(embedInfo || lesson.video_id || lesson.video_url);

    const renderVideo = () => {
        if (!hasVideo) return (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/10 p-12 bg-black/40">
                <HiOutlineVideoCameraSlash className="w-12 h-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">No primary lecture available</p>
            </div>
        );

        return (
            <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden group">
                {embedInfo ? (
                    <iframe
                        src={embedInfo.src}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Scholarly Study"
                    />
                ) : (
                    <video
                        key={lesson.video_id || lesson.video_url}
                        src={lesson.video_id ? storageService.getFileView(lesson.video_id).toString() : lesson.video_url}
                        controls
                        className="w-full h-full object-contain"
                        controlsList="nodownload"
                    >
                        Our cinematic theatre does not support this video format natively.
                    </video>
                )}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all" />
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-white/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-premium border border-white/60 relative">
            {/* Top Stage Label */}
            <div className="absolute top-4 left-6 z-10 pointer-events-none">
                <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-[0.2em] text-white/60 border border-white/10 italic">
                    Primary Lecture Stage
                </span>
            </div>

            {/* Video Content */}
            <div className="flex-1 min-h-0 bg-black/20">
                {renderVideo()}
            </div>

            {/* Action Footer */}
            <div className="flex-none h-20 bg-white/60 backdrop-blur-2xl border-t border-white/50 flex items-center justify-between px-8 lg:px-12 z-10">
                <div className="hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-1">Status</p>
                    <p className="text-sm font-bold text-base-content/60 italic">
                        {isCompleted ? 'Module Sync: Mastered' : <span>Draft Phase: <span className="text-primary italic">In Progress</span></span>}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button
                        onClick={onMarkCompleted}
                        disabled={isCompleted}
                        className={`flex-1 sm:flex-none px-6 py-3.5 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300
                            ${isCompleted
                                ? 'bg-success/10 text-success border border-success/20 shadow-sm'
                                : 'bg-primary text-white shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95'
                            }
                        `}
                    >
                        {isCompleted && <HiOutlineCheckCircle className="w-5 h-5" />}
                        {isCompleted ? 'Segment Mastered' : 'Complete Lesson'}
                    </button>

                    {onNextLesson && (
                        <button
                            onClick={onNextLesson}
                            className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-base-content text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-all duration-300 shadow-xl active:scale-95"
                        >
                            Continue
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
