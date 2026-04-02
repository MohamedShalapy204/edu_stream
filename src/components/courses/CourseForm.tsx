import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineInformationCircle, HiOutlineSquares2X2, HiOutlineChevronRight, HiOutlineChevronLeft, HiOutlinePhoto } from 'react-icons/hi2';
import type { ICourse } from '../../types';
import { courseSchema, type CourseInput } from '../../utils/validation';

export type CourseFormData = CourseInput;

interface CourseFormProps {
    initialData?: Partial<ICourse>;
    onSubmit: (data: CourseFormData) => void;
    isLoading?: boolean;
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSubmit, isLoading }) => {
    const [step, setStep] = useState(1);

    const { register, handleSubmit, formState: { errors } } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            is_published: initialData?.is_published || false,
            categories: initialData?.categories || [],
        }
    });

    const handleFinalSubmit = (data: CourseFormData) => {
        if (step !== 3) {
            setStep((s) => s + 1);
            return;
        }
        onSubmit(data);
    };

    return (
        <div className="bg-white dark:bg-surface-900 rounded-[2.5rem] shadow-2xl shadow-primary/5 p-10 overflow-hidden relative transition-colors duration-500">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { id: 1, label: 'Course Info', icon: HiOutlineInformationCircle },
                    { id: 2, label: 'Curriculum', icon: HiOutlineSquares2X2 },
                    { id: 3, label: 'Settings', icon: HiOutlinePhoto },
                ].map((s) => (
                    <div
                        key={s.id}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 shadow-sm whitespace-nowrap ${step === s.id
                            ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 scale-[1.02]'
                            : 'bg-surface-50 text-muted-foreground'
                            }`}
                    >
                        <s.icon className={`w-5 h-5 ${step === s.id ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-black tracking-tight uppercase tracking-[0.1em]">{s.label}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-8">
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
                                <label htmlFor="price" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Tuition ($)</label>
                                <input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`input input-bordered h-14 rounded-2xl bg-surface-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-semibold w-full ${errors.price ? 'ring-2 ring-destructive/20' : ''}`}
                                    {...register('price', { valueAsNumber: true })}
                                />
                                {errors.price && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.price.message}</p>}
                            </div>
                        </div>
                        <div className="space-y-3 text-left">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Curricular Brief</label>
                            <textarea
                                className="w-full h-40 bg-surface-50 rounded-3xl p-6 text-foreground font-semibold placeholder:text-muted-foreground italic focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none border-none"
                                placeholder="Describe your course goal and what students will learn..."
                                {...register('description')}
                            />
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
                        <div className="alert bg-indigo-50/50 border-none shadow-sm max-w-lg mx-auto rounded-[2rem] flex items-center gap-3">
                            <span className="font-bold text-sm tracking-tight text-primary">You will access the syllabus editor in the next phase of the workflow.</span>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-700 space-y-8">
                        <div className="bg-surface-50 p-12 rounded-[3rem] border-2 border-dashed border-muted text-center group hover:border-primary/20 transition-all duration-500">
                            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <HiOutlinePhoto className="w-10 h-10 text-muted-foreground" />
                            </div>
                            <h4 className="text-xl font-bold text-foreground mb-1 tracking-tighter">Course Visuals</h4>
                            <p className="text-sm text-muted-foreground mb-8 font-medium">Upload high-fidelity imagery for the course cover.</p>
                            <button
                                type="button"
                                className="btn btn-outline h-12 px-10 rounded-2xl bg-white text-xs font-black uppercase tracking-widest border-muted shadow-sm hover:border-primary/40 hover:text-primary transition-all no-animation"
                            >
                                Selection Gallery
                            </button>
                        </div>
                        <div className="flex items-center gap-6 p-8 bg-primary/5 rounded-[2.5rem] border border-primary/5 group cursor-pointer hover:bg-primary/10 transition-all">
                            <div className="relative flex items-center">
                                <input id="publish" type="checkbox" className="w-6 h-6 rounded-lg opacity-0 absolute cursor-pointer z-10" {...register('is_published')} />
                                <div className="w-6 h-6 rounded-lg border-2 border-primary/20 bg-white flex items-center justify-center transition-colors">
                                    <div className="w-3 h-3 bg-primary rounded-sm transition-transform scale-0 peer-checked:scale-100" />
                                </div>
                            </div>
                            <label htmlFor="publish" className="text-sm font-black text-primary uppercase tracking-widest cursor-pointer select-none">Deploy Course Immediately</label>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-12 border-t border-muted transition-colors">
                    <button
                        type="button"
                        className={`btn btn-ghost h-12 px-10 rounded-2xl text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all no-animation border-none ${step === 1 ? 'invisible' : ''}`}
                        onClick={() => setStep(s => s - 1)}
                    >
                        <HiOutlineChevronLeft className="w-5 h-5 mr-1" />
                        Retreat
                    </button>

                    <div className="flex gap-4">
                        {step < 3 ? (
                            <button
                                type="button"
                                className="btn btn-primary h-14 px-10 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transform hover:scale-[1.02] transition-all group no-animation border-none"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setStep((s) => s + 1);
                                }}
                            >
                                Advance
                                <HiOutlineChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="btn btn-primary h-14 px-12 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 transform hover:scale-[1.02] transition-all no-animation border-none"
                                disabled={isLoading}
                            >
                                {isLoading ? <span className="loading loading-spinner" /> : (initialData ? 'Commit Updates' : 'Launch Masterclass')}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
