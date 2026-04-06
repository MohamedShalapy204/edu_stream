import { type FC } from 'react';
import type { ILesson } from '@/features/courses';
import { storageService } from '@/services/appwrite/storage/storageService';
import { HiOutlineCheckCircle, HiOutlineArrowDownTray, HiOutlineVideoCameraSlash } from 'react-icons/hi2';

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
    return (
        <div className="w-full h-full flex flex-col bg-black/5 rounded-3xl overflow-hidden shadow-inner border border-white/20">
            {/* Visual Media Mount */}
            <div className="flex-1 w-full bg-black relative flex flex-col items-center justify-center">
                {lesson.video_id ? (
                    <video
                        key={lesson.video_id} // Forces remount on lesson change
                        controls
                        className="w-full h-full object-contain"
                        controlsList="nodownload" // Prevent basic downloading
                        poster={storageService.getFilePreview(lesson.video_id).toString()}
                    >
                        <source src={storageService.getFileView(lesson.video_id).toString()} type="video/mp4" />
                        Our cinematic theatre does not support this video format natively.
                    </video>
                ) : lesson.document_ids && lesson.document_ids.length > 0 ? (
                    <div className="p-12 text-center w-full max-w-2xl text-white/50">
                        <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 ring-1 ring-white/5 mb-8 inline-flex items-center justify-center backdrop-blur-md">
                            <HiOutlineArrowDownTray className="w-20 h-20 text-white/40" />
                        </div>
                        <h2 className="text-3xl font-heading font-black text-white tracking-tight mb-4">{lesson.title}</h2>
                        <p className="text-sm font-medium text-white/40 leading-relaxed mb-10">This segment is document-based. Please consult the supplementary materials attached below to fulfill this curriculum requirement.</p>

                        <div className="flex flex-col gap-4">
                            {lesson.document_ids.map((docId, index) => (
                                <a
                                    key={docId}
                                    href={storageService.getFileView(docId).toString()}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-left border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group"
                                >
                                    <span className="text-[10px] uppercase font-black tracking-widest text-white/80 group-hover:text-white">Document Exhibit {index + 1}</span>
                                    <HiOutlineArrowDownTray className="w-5 h-5 text-white/40 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-white/30 flex flex-col items-center">
                        <HiOutlineVideoCameraSlash className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">No media attached to this lesson.</p>
                    </div>
                )}
            </div>

            {/* Interaction Footer */}
            <div className="h-24 bg-white/60 backdrop-blur-2xl border-t border-white/50 flex items-center justify-between px-8">
                <div>
                    <h2 className="text-xl font-heading font-black text-base-content tracking-tight">{lesson.title}</h2>
                    {lesson.description && <p className="text-[10px] font-black uppercase tracking-widest text-base-content/40 mt-1 line-clamp-1">{lesson.description}</p>}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onMarkCompleted}
                        disabled={isCompleted}
                        className={`px-8 py-3 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-sm
                            ${isCompleted
                                ? 'bg-success/10 text-success border border-success/20 ring-1 ring-success/10'
                                : 'bg-white text-base-content hover:bg-base-200 border border-base-content/10 active:scale-95'
                            }
                        `}
                    >
                        {isCompleted && <HiOutlineCheckCircle className="w-5 h-5 animate-in zoom-in" />}
                        {isCompleted ? 'Segment Mastered' : 'Mark Complete'}
                    </button>

                    {onNextLesson && (
                        <button
                            onClick={onNextLesson}
                            className="px-8 py-3 rounded-2xl bg-base-content text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary transition-colors shadow-lg active:scale-95"
                        >
                            Next Section
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
