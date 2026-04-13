import React, { useState } from 'react';
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineInformationCircle, HiOutlineSquares2X2, HiOutlineChevronRight, HiOutlineChevronLeft, HiOutlinePhoto, HiOutlineBanknotes } from 'react-icons/hi2';
import type { ICourse } from '@/features/courses';
import { courseSchema, type CourseInput } from '../schemas/courseSchema';
import { VodafoneNumberInput } from '@/features/payment';
import { storageService } from '@/services/appwrite/storage/storageService';
import { useCurrentUser } from '@/hooks/useUser';
import { ProgressBar } from '@/components/ui/ProgressBar';

export type CourseFormData = CourseInput;

interface CourseFormProps {
    initialData?: Partial<ICourse>;
    onSubmit: (data: CourseFormData) => void;
    isLoading?: boolean;
    uploadProgress?: number;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, isLoading, uploadProgress = 0 }) => {
    const { data: currentUser } = useCurrentUser();
    const [step, setStep] = useState(1);
    const [preview, setPreview] = useState<string | null>(
        initialData?.thumbnail_url ||
        (initialData?.thumbnail_id ? storageService.getFilePreview(initialData.thumbnail_id).toString() : null)
    );

    const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema) as Resolver<CourseFormData>,
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            is_published: initialData?.is_published || false,
            categories: initialData?.categories || [],
            thumbnail_id: initialData?.thumbnail_id || '',
            language: initialData?.language || 'English',
            vodafone_cash_number: initialData?.vodafone_cash_number || '',
            allow_resubmission: initialData?.allow_resubmission || false,
        }
    });

    const price = watch('price');

    React.useEffect(() => {
        return () => {
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
            setValue('thumbnail', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleStepAdvance = async () => {
        if (step === 1) {
            const result = await trigger(['title', 'description', 'price', 'categories', 'language']);
            if (result) setStep(2);
        } else if (step === 2) {
            setStep(3);
        }
    };

    const handleFinalSubmit: SubmitHandler<CourseFormData> = (data) => {
        onSubmit(data);
    };

    return (
        <div className="bg-white dark:bg-surface-900 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-primary/5 p-6 md:p-10 overflow-hidden relative transition-colors duration-500">
            {/* Step Indicator */}
            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 1, label: 'Info', icon: HiOutlineInformationCircle },
                    { id: 2, label: 'Syllabus', icon: HiOutlineSquares2X2 },
                    { id: 3, label: 'Finalize', icon: HiOutlinePhoto },
                ].map((s) => (
                    <div
                        key={s.id}
                        className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl transition-all duration-300 shadow-sm whitespace-nowrap shrink-0 ${step === s.id
                            ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]'
                            : 'bg-surface-50 text-muted-foreground'
                            }`}
                    >
                        <s.icon className={`w-4 h-4 md:w-5 md:h-5 ${step === s.id ? 'animate-pulse' : ''}`} />
                        <span className="text-[10px] md:text-sm font-black tracking-tight uppercase">{s.label}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-6 md:space-y-8">
                {step === 1 && (
                    <div className="space-y-8 animate-in slide-in-from-right-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="title" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Masterclass Title</label>
                                <input
                                    id="title"
                                    placeholder="e.g. Architectural Design Masterclass"
                                    className={`input input-bordered h-14 rounded-2xl bg-surface-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-semibold w-full ${errors.title ? 'ring-2 ring-destructive/20' : ''}`}
                                    {...register('title')}
                                />
                                {errors.title && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="language" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Instructional Language</label>
                                <select
                                    id="language"
                                    className="select select-bordered h-14 rounded-2xl bg-surface-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-semibold w-full"
                                    {...register('language')}
                                >
                                    <option value="English">English</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Japanese">Japanese</option>
                                </select>
                                {errors.language && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.language.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="price" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Tuition (EGP)</label>
                                <input
                                    id="price"
                                    type="number"
                                    placeholder="0.00"
                                    className={`input input-bordered h-14 rounded-2xl bg-surface-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-sm md:text-base font-semibold w-full ${errors.price ? 'ring-2 ring-destructive/20' : ''}`}
                                    {...register('price', { valueAsNumber: true })}
                                />
                                {errors.price && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.price.message}</p>}
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="categories" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Categories (Comma separated)</label>
                                <input
                                    id="categories"
                                    placeholder="e.g. Design, Architecture, Art"
                                    className={`input input-bordered h-14 rounded-2xl bg-surface-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-semibold w-full ${errors.categories ? 'ring-2 ring-destructive/20' : ''}`}
                                    {...register('categories', {
                                        setValueAs: (v) => typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : v
                                    })}
                                />
                                {errors.categories && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.categories.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-3 text-left">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Curricular Brief</label>
                            <textarea
                                id="description"
                                className={`w-full h-32 md:h-40 bg-surface-50 rounded-[2rem] p-6 text-foreground font-semibold placeholder:text-muted-foreground italic focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none border-none text-sm md:text-base ${errors.description ? 'ring-2 ring-destructive/20' : ''}`}
                                placeholder="Describe your course goal and what students will learn..."
                                {...register('description')}
                            />
                            {errors.description && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.description.message}</p>}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right-4 duration-700 text-center py-10 scale-up">
                        <div className="bg-primary/5 p-8 rounded-full h-24 w-24 inline-flex items-center justify-center mb-8 shadow-inner shadow-primary/5">
                            <HiOutlineSquares2X2 className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 italic tracking-tight underline decoration-primary/20 underline-offset-8">Curriculum Builder</h3>
                        <p className="text-muted-foreground text-lg font-medium mb-10 max-w-sm mx-auto leading-relaxed">Sections and lessons are managed after the initial course creation to ensure pedagogical integrity.</p>
                        <div className="alert bg-indigo-50/50 border-none shadow-sm max-w-lg mx-auto rounded-4xl flex items-center gap-3">
                            <span className="font-bold text-sm tracking-tight text-primary">You will access the syllabus editor in the next phase of the workflow.</span>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-700 space-y-8">
                        <div
                            className="bg-surface-50 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-muted text-center group hover:border-primary/20 transition-all duration-500 relative cursor-pointer overflow-hidden min-h-[200px] md:min-h-[300px] flex flex-col justify-center"
                            onClick={() => document.getElementById('thumbnail-input')?.click()}
                        >
                            {preview ? (
                                <img src={preview} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                                <div className="h-16 w-16 md:h-20 md:w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                    <HiOutlinePhoto className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
                                </div>
                            )}
                            <div className={`relative z-10 ${preview ? 'bg-black/40 backdrop-blur-sm p-5 md:p-6 rounded-2xl mx-auto inline-block text-white w-[90%] md:w-4/5' : ''}`}>
                                <h4 className={`text-lg md:text-xl font-bold mb-1 tracking-tighter ${preview ? 'text-white' : 'text-foreground'}`}>Course Visuals</h4>
                                <p className={`text-xs md:text-sm mb-4 font-medium ${preview ? 'text-white/80' : 'text-muted-foreground'}`}>{preview ? 'Replace visual' : 'Upload high-fidelity imagery for the course cover.'}</p>
                                <input
                                    id="thumbnail-input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleThumbnailChange}
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline h-10 md:h-12 px-6 md:px-10 rounded-xl md:rounded-2xl bg-white text-[9px] md:text-xs font-black uppercase tracking-widest border-muted shadow-sm hover:border-primary/40 hover:text-primary transition-all no-animation"
                                >
                                    {preview ? 'Replace Visual' : 'Selection Gallery'}
                                </button>
                            </div>
                        </div>

                        {price > 0 && (
                            <div className="space-y-8 p-10 bg-surface-50 rounded-[3rem] border border-muted/20 animate-in fade-in zoom-in duration-500">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="p-3 bg-primary/10 rounded-2xl">
                                        <HiOutlineBanknotes className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black tracking-tight">Payment Settings</h4>
                                        <p className="text-xs text-muted-foreground font-medium">Configure manual Vodafone Cash enrollment</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <div className="space-y-4">
                                        <VodafoneNumberInput
                                            label="Course Payment Number"
                                            register={register('vodafone_cash_number')}
                                            error={errors.vodafone_cash_number}
                                            description="Students will transfer the tuition to this number."
                                        />

                                        {currentUser?.vodafone_cash_number && (
                                            <div className="flex items-center gap-3 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 w-fit animate-in fade-in slide-in-from-left-2 duration-500">
                                                <input
                                                    id="use_default"
                                                    type="checkbox"
                                                    className="checkbox checkbox-primary checkbox-xs rounded-md"
                                                    onChange={(e) => {
                                                        if (e.target.checked && currentUser.vodafone_cash_number) {
                                                            setValue('vodafone_cash_number', currentUser.vodafone_cash_number, { shouldValidate: true });
                                                        }
                                                    }}
                                                />
                                                <label htmlFor="use_default" className="text-[10px] font-black text-primary/80 uppercase tracking-widest cursor-pointer select-none">
                                                    Use my global default number
                                                </label>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Re-submission Policy</label>
                                        <div className="flex items-center gap-6 p-4 bg-white rounded-2xl border border-muted/10 group cursor-pointer hover:bg-surface-50 transition-all relative h-14">
                                            <div className="relative flex items-center">
                                                <input
                                                    id="allow_resubmission"
                                                    type="checkbox"
                                                    className="peer w-6 h-6 rounded-lg opacity-0 absolute cursor-pointer z-10"
                                                    {...register('allow_resubmission')}
                                                />
                                                <div className="w-6 h-6 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                                                    <HiOutlineChevronRight className="w-4 h-4 text-white transition-transform scale-0 peer-checked:scale-100" />
                                                </div>
                                            </div>
                                            <label htmlFor="allow_resubmission" className="text-[10px] font-black text-foreground uppercase tracking-widest cursor-pointer select-none">Allow denied students to retry</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-6 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/5 group cursor-pointer hover:bg-primary/10 transition-all relative">
                            <div className="relative flex items-center">
                                <input
                                    id="is_published"
                                    type="checkbox"
                                    className="peer w-6 h-6 rounded-lg opacity-0 absolute cursor-pointer z-10"
                                    {...register('is_published')}
                                />
                                <div className="w-6 h-6 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center transition-all peer-checked:bg-primary peer-checked:border-primary">
                                    <HiOutlineChevronRight className="w-4 h-4 text-white transition-transform scale-0 peer-checked:scale-100" />
                                </div>
                            </div>
                            <label htmlFor="is_published" className="text-sm font-black text-primary uppercase tracking-widest cursor-pointer select-none">Deploy Course Immediately</label>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between pt-8 md:pt-12 border-t border-muted transition-colors gap-6 sm:gap-0">
                    <button
                        type="button"
                        className={`btn btn-ghost h-12 px-10 rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all no-animation border-none sm:order-1 ${step === 1 ? 'invisible md:block' : ''}`}
                        onClick={() => setStep(s => s - 1)}
                    >
                        <HiOutlineChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1" />
                        Retreat
                    </button>

                    <div className="flex gap-4 w-full sm:w-auto sm:order-2">
                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={handleStepAdvance}
                                className="btn btn-primary h-14 px-10 rounded-3xl md:rounded-4xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all group no-animation border-none w-full sm:w-auto"
                            >
                                Advance
                                <HiOutlineChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="flex flex-col items-end gap-3 w-full sm:w-72">
                                {isLoading && uploadProgress > 0 && (
                                    <div className="w-full px-2 mb-2">
                                        <ProgressBar progress={uploadProgress} label="Uploading Assets" />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-full h-14 px-8 md:px-12 rounded-3xl md:rounded-4xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transform hover:scale-[1.02] transition-all no-animation border-none"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <span className="loading loading-spinner" /> : (initialData?.$id ? 'Commit Updates' : 'Launch Masterclass')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
