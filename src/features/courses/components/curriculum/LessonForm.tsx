import React, { useState } from 'react';
import { useCreateLesson, useUpdateLesson } from '@/features/courses/hooks/useLessonActions';
import { storageService } from '@/services/appwrite/storage/storageService';
import { HiOutlineDocument } from 'react-icons/hi2';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { ILesson } from '@/features/courses/types/courseTypes';

interface LessonFormProps {
    sectionId: string;
    courseId: string;
    nextOrder: number;
    initialData?: ILesson;
    onCancel: () => void;
    onSuccess: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({ sectionId, courseId, nextOrder, initialData, onCancel, onSuccess }) => {
    const { mutate: createLesson, isPending: isCreating } = useCreateLesson();
    const { mutate: updateLesson, isPending: isUpdating } = useUpdateLesson();

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
    const [files, setFiles] = useState<File[]>([]);
    const [isFree, setIsFree] = useState(initialData?.is_free || false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isEditMode = Boolean(initialData);
    const isPending = isCreating || isUpdating;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsUploading(true);
        let finalDocumentIds: string[] = initialData?.document_ids || [];

        try {
            if (files.length > 0) {
                const progresses = new Array(files.length).fill(0);
                const uploadPromises = files.map((file: File, idx: number) => storageService.uploadFile(file, (p) => {
                    progresses[idx] = p.progress;
                    const total = progresses.reduce((a, b) => a + b, 0) / files.length;
                    setUploadProgress(total);
                }));
                const uploadedFiles = await Promise.all(uploadPromises);
                const newDocumentIds = uploadedFiles.map((f: { $id: string }) => f.$id);
                // For now, we append new documents to existing ones
                finalDocumentIds = [...finalDocumentIds, ...newDocumentIds];
            }

            const payload = {
                section_id: sectionId,
                course_id: courseId,
                title,
                description,
                video_url: videoUrl ? videoUrl : undefined,
                document_ids: finalDocumentIds.length > 0 ? finalDocumentIds : undefined,
                is_free: isFree,
                order: initialData ? initialData.order : nextOrder
            };

            if (isEditMode && initialData) {
                updateLesson(
                    { lessonId: initialData.$id, data: payload },
                    {
                        onSuccess: () => {
                            setIsUploading(false);
                            onSuccess();
                        },
                        onError: () => setIsUploading(false)
                    }
                );
            } else {
                createLesson(
                    payload,
                    {
                        onSuccess: () => {
                            setIsUploading(false);
                            onSuccess();
                        },
                        onError: () => setIsUploading(false)
                    }
                );
            }
        } catch (error) {
            console.error('Failed to upload file', error);
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-2xl border border-primary/20 shadow-xl space-y-5 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between border-b border-base-content/5 pb-4">
                <h5 className="text-sm font-black uppercase tracking-widest text-primary">
                    {isEditMode ? 'Refine Lesson' : 'New Lesson'}
                </h5>
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

                <div className="flex flex-col gap-4">
                    <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="YouTube or Vimeo URL (Optional)"
                        className="w-full h-12 bg-base-200/50 rounded-xl px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 border border-transparent focus:border-primary/50 transition-all"
                    />

                    <div className="relative group">
                        <input
                            type="file"
                            multiple
                            onChange={(e) => setFiles(Array.from(e.target.files || []))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                        />
                        <div className={`w-full h-12 flex items-center justify-between px-4 rounded-xl border-2 border-dashed transition-all ${files.length > 0 ? 'bg-primary/5 border-primary/30 text-primary' : 'bg-base-200/50 border-base-content/10 group-hover:bg-base-200 group-hover:border-primary/20'}`}>
                            <span className="text-sm font-bold truncate max-w-[80%]">
                                {files.length > 0 ? `${files.length} Document(s) Attached` : isEditMode ? 'Update/Add Documents (Optional)' : 'Attach Documents (PDF, ZIP, etc) - Optional'}
                            </span>
                            <HiOutlineDocument className="w-5 h-5 opacity-50" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-start">
                    <label className="flex items-center gap-3 h-12 px-4 bg-base-200/50 rounded-xl cursor-pointer">
                        <input type="checkbox" checked={isFree} onChange={(e) => setIsFree(e.target.checked)} className="checkbox checkbox-sm checkbox-primary rounded-md" />
                        <span className="text-xs font-black uppercase tracking-widest text-base-content/60">Free Preview</span>
                    </label>
                </div>
            </div>

            <div className="pt-2 flex flex-col items-end gap-3">
                {isUploading && uploadProgress > 0 && (
                    <div className="w-full sm:w-1/2 px-2">
                        <ProgressBar progress={uploadProgress} label="Synchronizing Attachments" />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={isPending || isUploading || !title.trim()}
                    className="btn btn-primary h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all border-none"
                >
                    {isPending || isUploading ? <span className="loading loading-spinner loading-xs" /> : isEditMode ? 'Refine Segment' : 'Save Lesson'}
                </button>
            </div>
        </form>
    );
};

export default LessonForm;
