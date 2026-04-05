import React, { useState } from 'react';
import { useCreateLesson } from '@/features/courses/hooks/useLessonActions';
import { ContentType } from '@/features/courses/types/courseTypes';

interface LessonFormProps {
    sectionId: string;
    courseId: string;
    nextOrder: number;
    onCancel: () => void;
    onSuccess: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({ sectionId, courseId, nextOrder, onCancel, onSuccess }) => {
    const { mutate: createLesson, isPending } = useCreateLesson();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentType, setContentType] = useState<ContentType>(ContentType.VIDEO);
    const [videoUrl, setVideoUrl] = useState('');
    const [isFree, setIsFree] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        createLesson(
            {
                section_id: sectionId,
                course_id: courseId,
                title,
                description,
                content_type: contentType,
                video_url: videoUrl,
                is_free: isFree,
                order: nextOrder
            },
            {
                onSuccess
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-primary/20 shadow-xl space-y-5 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-base-content/5 pb-4">
                <h5 className="text-sm font-black uppercase tracking-widest text-primary">New Lesson</h5>
                <button type="button" onClick={onCancel} className="text-xs font-bold text-base-content/40 hover:text-base-content">Cancel</button>
            </div>

            <div className="space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Lesson Title"
                    className="w-full h-12 bg-base-200/50 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                    required
                />

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of the lesson content..."
                    className="w-full h-24 bg-base-200/50 rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all resize-none"
                />

                <div className="grid grid-cols-2 flex-wrap gap-4">
                    <select
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value as ContentType)}
                        className="h-12 bg-base-200/50 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {Object.values(ContentType).map(ct => (
                            <option key={ct} value={ct}>{ct.toUpperCase()}</option>
                        ))}
                    </select>

                    <label className="flex items-center gap-3 h-12 px-4 bg-base-200/50 rounded-xl cursor-pointer">
                        <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="checkbox checkbox-sm checkbox-primary rounded-md" />
                        <span className="text-xs font-black uppercase tracking-widest text-base-content/60">Free Preview</span>
                    </label>
                </div>

                {contentType === ContentType.VIDEO && (
                    <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="YouTube or Vimeo URL (e.g. https://youtu.be/...)"
                        className="w-full h-12 bg-base-200/50 rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                    />
                )}
            </div>

            <div className="pt-2 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending || !title.trim()}
                    className="btn btn-primary h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all border-none"
                >
                    {isPending ? <span className="loading loading-spinner loading-xs" /> : 'Save Lesson'}
                </button>
            </div>
        </form>
    );
};

export default LessonForm;
