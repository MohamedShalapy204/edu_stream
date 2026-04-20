import { HiChevronDown, HiOutlineDocumentText, HiOutlineVideoCamera, HiPlus, HiOutlineTrash, HiArrowUp, HiArrowDown, HiOutlinePencilSquare } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import type { ISection, ILesson } from '@/features/courses/types/courseTypes';
import { useGetSectionLessons, useUpdateLesson, useDeleteLesson } from '@/features/courses/hooks/useLessonActions';
import { LessonForm } from './LessonForm';
import { useState } from 'react';

interface SectionItemProps {
    section: ISection;
    index: number;
    totalSections: number;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
}

export const SectionItem: React.FC<SectionItemProps> = ({ section, index, totalSections, onMoveUp, onMoveDown, onDelete }) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isAddingLesson, setIsAddingLesson] = useState(false);
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

    // Auto-fetch lessons when expanded
    const { data: lessons, isLoading } = useGetSectionLessons(section.$id);
    const { mutate: updateLesson } = useUpdateLesson();
    const { mutate: deleteLesson } = useDeleteLesson();

    const handleMoveLesson = (e: React.MouseEvent, lessonIndex: number, direction: 'up' | 'down') => {
        e.stopPropagation();
        if (!lessons?.documents) return;

        const targetIndex = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
        if (targetIndex < 0 || targetIndex >= lessons.documents.length) return;

        const currentLesson = lessons.documents[lessonIndex];
        const adjacentLesson = lessons.documents[targetIndex];

        updateLesson({ lessonId: currentLesson.$id, data: { order: adjacentLesson.order ?? targetIndex } });
        updateLesson({ lessonId: adjacentLesson.$id, data: { order: currentLesson.order ?? lessonIndex } });
    };

    const handleDeleteLesson = (e: React.MouseEvent, lessonId: string) => {
        e.stopPropagation();
        if (window.confirm(t('teacher.sectionItem.deleteLessonConfirm'))) {
            deleteLesson(lessonId);
        }
    };

    const handleEditLesson = (e: React.MouseEvent, lessonId: string) => {
        e.stopPropagation();
        setEditingLessonId(lessonId);
    };

    return (
        <div className="bg-base-100/80 rounded-3xl shadow-premium border border-base-content/5 overflow-hidden transition-all duration-300">
            {/* Section Header */}
            <div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 cursor-pointer hover:bg-base-200/20 transition-colors gap-4"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/5 text-primary font-black text-xs md:text-sm flex py-2 items-center justify-center shrink-0">
                        {index + 1}
                    </div>
                    <h4 className="text-base md:text-lg font-bold text-base-content tracking-tight truncate">{section.title}</h4>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                    <span className="text-[10px] font-black text-base-content/30 uppercase tracking-widest mr-2">{lessons?.documents.length || 0} {t('teacher.sectionItem.lessonsCount')}</span>

                    {/* Section Controls */}
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button disabled={index === 0} onClick={onMoveUp} className="btn btn-xs md:btn-sm btn-ghost btn-square disabled:opacity-30">
                            <HiArrowUp className="w-4 h-4" />
                        </button>
                        <button disabled={index === totalSections - 1} onClick={onMoveDown} className="btn btn-xs md:btn-sm btn-ghost btn-square disabled:opacity-30">
                            <HiArrowDown className="w-4 h-4" />
                        </button>
                        <button onClick={onDelete} className="btn btn-xs md:btn-sm btn-ghost btn-square text-error hover:bg-error/10">
                            <HiOutlineTrash className="w-4 h-4" />
                        </button>
                    </div>

                    <HiChevronDown className={`w-5 h-5 text-base-content/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Section Content */}
            {isExpanded && (
                <div className="p-6 pt-0 border-t border-base-content/5 bg-base-200/10">
                    <div className="space-y-3 mt-6">
                        {isLoading ? (
                            <div className="py-4 text-center"><span className="loading loading-spinner text-primary/20" /></div>
                        ) : (
                            lessons?.documents.map((lesson, lessonIdx) => (
                                editingLessonId === lesson.$id ? (
                                    <LessonForm
                                        key={lesson.$id}
                                        sectionId={section.$id}
                                        courseId={section.course_id}
                                        nextOrder={lesson.order}
                                        initialData={lesson as unknown as ILesson}
                                        onCancel={() => setEditingLessonId(null)}
                                        onSuccess={() => setEditingLessonId(null)}
                                    />
                                ) : (
                                    <div key={lesson.$id} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-white rounded-2xl border border-base-content/5 shadow-sm group hover:border-primary/20 transition-colors gap-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="text-base-content/20 group-hover:text-primary transition-colors shrink-0">
                                                {lesson.video_url || lesson.video_id ? <HiOutlineVideoCamera className="w-4 h-4 md:w-5 md:h-5" /> : <HiOutlineDocumentText className="w-4 h-4 md:w-5 md:h-5" />}
                                            </div>
                                            <span className="text-sm font-bold text-base-content truncate">{lesson.title}</span>
                                            {lesson.is_free && <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[8px] font-black uppercase tracking-widest ml-1">{t('teacher.sectionItem.free')}</span>}
                                        </div>
                                        <div className="flex items-center justify-end gap-1">
                                            {/* Lesson Controls - Visible on desktop hover, always on mobile touch */}
                                            <button onClick={(e) => handleEditLesson(e, lesson.$id)} className="btn btn-xs btn-ghost btn-square lg:opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary">
                                                <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                                            </button>
                                            <button disabled={lessonIdx === 0} onClick={(e) => handleMoveLesson(e, lessonIdx, 'up')} className="btn btn-xs btn-ghost btn-square lg:opacity-0 group-hover:opacity-100 disabled:opacity-10 transition-opacity">
                                                <HiArrowUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button disabled={lessonIdx === (lessons?.documents.length || 0) - 1} onClick={(e) => handleMoveLesson(e, lessonIdx, 'down')} className="btn btn-xs btn-ghost btn-square lg:opacity-0 group-hover:opacity-100 disabled:opacity-10 transition-opacity">
                                                <HiArrowDown className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={(e) => handleDeleteLesson(e, lesson.$id)} className="btn btn-xs btn-ghost btn-square text-error lg:opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:bg-error/10">
                                                <HiOutlineTrash className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))
                        )}

                        {isAddingLesson ? (
                            <LessonForm
                                sectionId={section.$id}
                                courseId={section.course_id}
                                nextOrder={lessons?.documents.length || 0}
                                onCancel={() => setIsAddingLesson(false)}
                                onSuccess={() => setIsAddingLesson(false)}
                            />
                        ) : (
                            <button
                                onClick={() => setIsAddingLesson(true)}
                                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-base-content/10 rounded-2xl text-xs font-black text-base-content/40 uppercase tracking-widest hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all outline-none"
                            >
                                <HiPlus className="w-4 h-4" /> {t('teacher.sectionItem.addLesson')}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionItem;
