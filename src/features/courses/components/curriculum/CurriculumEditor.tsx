import React, { useState } from 'react';
import { HiPlus, HiOutlineSparkles } from 'react-icons/hi2';
import { useGetCourseSections, useCreateSection, useDeleteSection, useUpdateSection } from '@/features/courses/hooks/useSectionActions';
import SectionItem from './SectionItem';

export const CurriculumEditor: React.FC<{ courseId: string }> = ({ courseId }) => {
    const { data: sections, isLoading } = useGetCourseSections(courseId);
    const { mutate: createSection, isPending } = useCreateSection();
    const { mutate: deleteSection } = useDeleteSection();
    const { mutate: updateSection } = useUpdateSection();

    const [newSectionTitle, setNewSectionTitle] = useState('');

    const handleCreateSection = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSectionTitle.trim()) return;

        createSection(
            {
                course_id: courseId,
                title: newSectionTitle,
                order: sections?.documents?.length || 0
            },
            {
                onSuccess: () => setNewSectionTitle('')
            }
        );
    };

    const handleMoveSection = (index: number, direction: 'up' | 'down') => {
        if (!sections?.documents) return;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= sections.documents.length) return;

        const currentSection = sections.documents[index];
        const adjacentSection = sections.documents[targetIndex];

        // Swap their orders in the DB
        updateSection({ sectionId: currentSection.$id, data: { order: adjacentSection.order ?? targetIndex } });
        updateSection({ sectionId: adjacentSection.$id, data: { order: currentSection.order ?? index } });
    };

    const handleDeleteSection = (sectionId: string) => {
        if (window.confirm('Are you sure you want to delete this section? All its lessons will be lost.')) {
            deleteSection(sectionId);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <span className="loading loading-spinner text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-heading font-black text-base-content mb-1">Curriculum Modules</h3>
                    <p className="text-sm font-medium text-base-content/50">Structure your knowledge into thematic sections and granular lessons.</p>
                </div>
            </div>

            <div className="space-y-6">
                {sections?.documents.map((section, idx) => (
                    <SectionItem
                        key={section.$id}
                        section={section}
                        index={idx}
                        totalSections={sections.documents.length}
                        onMoveUp={() => handleMoveSection(idx, 'up')}
                        onMoveDown={() => handleMoveSection(idx, 'down')}
                        onDelete={() => handleDeleteSection(section.$id)}
                    />
                ))}

                {sections?.documents.length === 0 && (
                    <div className="p-12 text-center bg-base-200/30 rounded-3xl border border-dashed border-base-content/10">
                        <HiOutlineSparkles className="w-10 h-10 text-primary/30 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-base-content mb-2">No Sections Yet</h4>
                        <p className="text-sm text-base-content/40">Start building your curriculum by adding your first section below.</p>
                    </div>
                )}
            </div>

            <form onSubmit={handleCreateSection} className="flex items-center gap-4 bg-white/40 backdrop-blur-3xl p-4 rounded-3xl shadow-sm border border-base-content/5">
                <input
                    type="text"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="E.g., Week 1: Foundations of Atheneum..."
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm font-bold placeholder:font-medium placeholder:text-base-content/30"
                    disabled={isPending}
                />
                <button
                    type="submit"
                    disabled={isPending || !newSectionTitle.trim()}
                    className="btn btn-primary btn-sm h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-none no-animation hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    {isPending ? <span className="loading loading-spinner loading-xs" /> : <HiPlus className="w-4 h-4" />}
                    Add Section
                </button>
            </form>
        </div>
    );
};

export default CurriculumEditor;
