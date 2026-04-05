import React, { useState } from 'react';
import { HiChevronDown, HiOutlineDocumentText, HiOutlineVideoCamera, HiPlus } from 'react-icons/hi2';
import type { ISection } from '@/features/courses/types/courseTypes';
import { ContentType } from '@/features/courses/types/courseTypes';
import { useGetSectionLessons } from '@/features/courses/hooks/useLessonActions';
import { LessonForm } from './LessonForm';

interface SectionItemProps {
    section: ISection;
    index: number;
}

export const SectionItem: React.FC<SectionItemProps> = ({ section, index }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isAddingLesson, setIsAddingLesson] = useState(false);

    // Auto-fetch lessons when expanded
    const { data: lessons, isLoading } = useGetSectionLessons(section.$id);

    return (
        <div className="bg-white rounded-3xl shadow-premium border border-base-content/5 overflow-hidden transition-all duration-300">
            {/* Section Header */}
            <div
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-base-200/20 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary font-black text-sm flex items-center justify-center">
                        {index + 1}
                    </div>
                    <h4 className="text-lg font-bold text-base-content tracking-tight">{section.title}</h4>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-base-content/30 uppercase tracking-widest">{lessons?.documents.length || 0} Lessons</span>
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
                            lessons?.documents.map((lesson) => (
                                <div key={lesson.$id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-base-content/5 shadow-sm group hover:border-primary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="text-base-content/20 group-hover:text-primary transition-colors">
                                            {lesson.content_type === ContentType.VIDEO ? <HiOutlineVideoCamera className="w-5 h-5" /> : <HiOutlineDocumentText className="w-5 h-5" />}
                                        </div>
                                        <span className="text-sm font-bold text-base-content">{lesson.title}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {lesson.is_free && <span className="px-2 py-0.5 rounded-md bg-success/10 text-success text-[9px] font-black uppercase tracking-widest">Free</span>}
                                        <span className="text-[10px] font-black text-base-content/30">Order: {lesson.order}</span>
                                    </div>
                                </div>
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
                                <HiPlus className="w-4 h-4" /> Add Lesson
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionItem;
