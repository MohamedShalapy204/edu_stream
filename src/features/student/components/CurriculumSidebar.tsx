import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HiOutlineChevronDown, HiOutlineCheckCircle, HiOutlinePlayCircle, HiOutlineDocumentText } from 'react-icons/hi2';
import type { ISection, ILesson } from '@/features/courses';
import type { ICourseProgress } from '../types';

interface CurriculumSidebarProps {
    sections: ISection[];
    lessons: ILesson[];
    activeLessonId?: string;
    onSelectLesson: (lessonId: string) => void;
    progress?: ICourseProgress;
}

export const CurriculumSidebar: FC<CurriculumSidebarProps> = ({
    sections,
    lessons,
    activeLessonId,
    onSelectLesson,
    progress
}) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {};
        sections.forEach(s => { initial[s.$id] = true; });
        return initial;
    });

    const toggleSection = (id: string) => {
        setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const completedIds = progress?.completed_lessons || [];

    // Group lessons by section
    const getLessonsForSection = (sectionId: string) =>
        lessons.filter(l => l.section_id === sectionId).sort((a, b) => a.order - b.order);

    return (
        <div className="h-full w-full bg-base-200 border-l border-base-content/5 flex flex-col">
            <div className="p-6 border-b border-base-content/5">
                <h3 className="label-caps !text-primary/60">Curriculum Index</h3>
                <div className="mt-4 bg-primary/5 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: lessons.length > 0 ? `${(completedIds.length / lessons.length) * 100}%` : '0%' }}
                        className="h-full bg-primary shadow-[0_0_12px_rgba(var(--p),0.5)]"
                    />
                </div>
                <div className="flex justify-between items-center mt-3">
                    <p className="label-caps !text-[10px] text-primary">
                        {completedIds.length} / {lessons.length} Segments Mastered
                    </p>
                    <span className="label-caps !text-[10px] tabular opacity-40">
                        {lessons.length > 0 ? Math.round((completedIds.length / lessons.length) * 100) : 0}%
                    </span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {sections.map(section => {
                    const sectionLessons = getLessonsForSection(section.$id);
                    const isExpanded = expandedSections[section.$id];

                    return (
                        <div key={section.$id} className="bg-base-100 rounded-2xl border border-base-content/5 overflow-hidden shadow-sm">
                            <button
                                onClick={() => toggleSection(section.$id)}
                                className="w-full p-4 flex items-center justify-between hover:bg-base-200/50 transition-colors"
                            >
                                <span className="font-heading font-bold text-sm text-base-content/80 text-left">
                                    {section.title}
                                </span>
                                <HiOutlineChevronDown className={`w-4 h-4 text-base-content/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-base-content/10"
                                    >
                                        <div className="p-2 space-y-1">
                                            {sectionLessons.map((lesson, idx) => {
                                                const isActive = activeLessonId === lesson.$id;
                                                const isCompleted = completedIds.includes(lesson.$id);

                                                return (
                                                    <button
                                                        key={lesson.$id}
                                                        onClick={() => onSelectLesson(lesson.$id)}
                                                        className={`w-full p-3 rounded-xl flex items-start gap-3 transition-all text-left group
                                                            ${isActive
                                                                ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02]'
                                                                : 'hover:bg-base-200/50 text-base-content/60'
                                                            }
                                                        `}
                                                    >
                                                        <div className={`mt-0.5 shrink-0 transition-all duration-500
                                                            ${isActive ? 'text-primary-content scale-110' : isCompleted ? 'text-success' : 'text-primary/20 group-hover:text-primary group-hover:scale-110'}
                                                        `}>
                                                            {isCompleted ? (
                                                                <HiOutlineCheckCircle className="w-5 h-5 shadow-sm" />
                                                            ) : lesson.video_id ? (
                                                                <HiOutlinePlayCircle className="w-5 h-5" />
                                                            ) : (
                                                                <HiOutlineDocumentText className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs font-semibold truncate tracking-tight ${isActive ? 'text-primary-content' : 'text-base-content/80'}`}>
                                                                <span className="opacity-40 tabular mr-2">{String(idx + 1).padStart(2, '0')}.</span>
                                                                {lesson.title}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                {lesson.duration && (
                                                                    <span className={`label-caps !text-[9px] tabular ${isActive ? 'text-primary-content/60' : 'text-base-content/30'}`}>
                                                                        {Math.floor(lesson.duration / 60)}m {lesson.duration % 60}s
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {sectionLessons.length === 0 && (
                                                <div className="p-4 text-center label-caps opacity-20">
                                                    Curriculum Pending
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
