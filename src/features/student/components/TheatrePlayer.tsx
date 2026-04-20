import { type FC, useMemo } from 'react';
import type { ILesson } from '@/features/courses';
import { storageService } from '@/services/appwrite/storage/storageService';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const embedInfo = useMemo(() => {
        const url = lesson.video_url || lesson.video_id || '';
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
        const driveRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=[a-zA-Z]+&)?id=)([a-zA-Z0-9_-]+)/;
        const driveMatch = url.match(driveRegex);
        if (driveMatch) {
            return { type: 'google_drive', src: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
        }
        return null;
    }, [lesson.video_url, lesson.video_id]);

    const hasVideo = Boolean(embedInfo || lesson.video_id || lesson.video_url);

    const renderVideo = () => {
        return (
            <div className="w-full h-full bg-black relative flex items-center justify-center overflow-hidden group">
                {embedInfo ? (
                    <iframe
                        src={embedInfo.src}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={t('theatre.scholarlyStudy')}
                    />
                ) : (
                    <video
                        key={lesson.video_id || lesson.video_url}
                        src={(lesson.video_id && !lesson.video_id.startsWith('http')) ? storageService.getFileView(lesson.video_id).toString() : (lesson.video_url || lesson.video_id)}
                        controls
                        className="w-full h-full object-contain"
                        controlsList="nodownload"
                    >
                        {t('theatre.videoFormatNotSupported')}
                    </video>
                )}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all" />
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col bg-base-100/40 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden shadow-premium border border-base-content/15 relative">
            {/* Top Stage Label & Video Content — only when video exists */}
            {hasVideo && (
                <>
                    <div className="absolute top-4 left-6 z-10 pointer-events-none">
                        <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full label-caps !text-[8px] !text-white/60 border border-white/10 italic">
                            {t('theatre.primaryLectureStage')}
                        </span>
                    </div>

                    <div className="flex-1 min-h-0 bg-black/20">
                        {renderVideo()}
                    </div>
                </>
            )}

            {/* Action Footer */}
            <div className="flex-none min-h-20 md:h-24 bg-base-200/50 backdrop-blur-2xl border-t border-base-content/10 flex flex-col sm:flex-row items-center justify-between px-6 md:px-12 py-4 sm:py-0 z-10 gap-4 sm:gap-0">
                <div className="hidden sm:block">
                    <p className="label-caps !text-primary/60 mb-1">{t('theatre.synthesisStatus')}</p>
                    <p className="text-sm font-heading font-bold text-base-content/60 italic">
                        {isCompleted ? t('theatre.cognitiveMasteryAttained') : <span>{t('theatre.intellectualSynthesis')}: <span className="text-primary">{t('theatre.inProgress')}</span></span>}
                    </p>
                </div>

                <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                    <button
                        onClick={onMarkCompleted}
                        disabled={isCompleted}
                        className={`flex-1 sm:flex-none px-6 py-3.5 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 label-caps transition-all duration-300
                            ${isCompleted
                                ? 'bg-success/10 text-success border border-success/20 shadow-sm'
                                : 'bg-primary/80 text-primary-content shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95'
                            }
                        `}
                    >
                        {isCompleted && <HiOutlineCheckCircle className="w-4.5 h-4.5 md:w-5 md:h-5" />}
                        {isCompleted ? t('theatre.segmentMastered') : t('theatre.declareMastery')}
                    </button>

                    {onNextLesson && (
                        <button
                            onClick={onNextLesson}
                            className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl md:rounded-2xl bg-base-100 label-caps hover:bg-primary hover:text-primary-content transition-all duration-300 shadow-xl active:scale-95"
                        >
                            {t('theatre.proceedToNextSegment')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
