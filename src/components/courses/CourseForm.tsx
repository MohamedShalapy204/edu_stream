import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiInformationCircle, HiCollection, HiChevronRight, HiChevronLeft, HiPhotograph } from 'react-icons/hi';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
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
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-10 overflow-hidden relative">
            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                {[
                    { id: 1, label: 'Course Info', icon: HiInformationCircle },
                    { id: 2, label: 'Curriculum', icon: HiCollection },
                    { id: 3, label: 'Settings', icon: HiPhotograph },
                ].map((s) => (
                    <div
                        key={s.id}
                        className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all duration-300 whitespace-nowrap ${step === s.id
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20'
                            : 'bg-slate-50 text-slate-400'
                            }`}
                    >
                        <s.icon className={`w-5 h-5 ${step === s.id ? 'animate-pulse' : ''}`} />
                        <span className="text-sm font-bold tracking-tight">{s.label}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-8">
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Course Title"
                                placeholder="e.g. Master React in 30 Days"
                                error={errors.title?.message}
                                {...register('title')}
                            />
                            <Input
                                label="Price ($)"
                                type="number"
                                placeholder="0.00"
                                error={errors.price?.message}
                                {...register('price', { valueAsNumber: true })}
                            />
                        </div>
                        <div className="space-y-1.5 text-left">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                            <textarea
                                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-slate-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                                placeholder="Describe your course goal and what students will learn..."
                                {...register('description')}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right-4 duration-500 text-center py-10">
                        <div className="bg-blue-50 p-6 rounded-full inline-block mb-6">
                            <HiCollection className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Curriculum Builder</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Sections and lessons are managed after the initial course creation for better performance.</p>
                        <Alert
                            type="info"
                            message="You will be able to add sections and lessons in the next phase of the editor."
                        />
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
                            <HiPhotograph className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-900 mb-1">Course Thumbnail</h4>
                            <p className="text-sm text-slate-500 mb-6">Upload a high-quality cover image (16:9 recommended).</p>
                            <Button variant="secondary" type="button" className="rounded-2xl">
                                Select File
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 p-6 bg-blue-50 rounded-3xl border border-blue-100">
                            <input type="checkbox" className="w-5 h-5 rounded-lg border-blue-200 shadow-sm transition-all focus:ring-blue-500 text-blue-600" {...register('is_published')} />
                            <label className="text-sm font-bold text-blue-900">Publish course immediately</label>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        type="button"
                        className={`h-12 px-8 ${step === 1 ? 'invisible' : ''}`}
                        leftIcon={<HiChevronLeft className="w-5 h-5" />}
                        onClick={() => setStep(s => s - 1)}
                    >
                        Previous
                    </Button>

                    {step < 3 ? (
                        <Button
                            variant="primary"
                            type="button"
                            className="h-12 px-8 shadow-xl shadow-blue-500/10"
                            rightIcon={<HiChevronRight className="w-5 h-5" />}
                            onClick={(e) => {
                                e.preventDefault();
                                setStep((s) => s + 1);
                            }}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            type="submit"
                            className="h-12 px-10 shadow-xl shadow-blue-500/20"
                            isLoading={isLoading}
                        >
                            {initialData ? 'Update Course' : 'Create Course'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
