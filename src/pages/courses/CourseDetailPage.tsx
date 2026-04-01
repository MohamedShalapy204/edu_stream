import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetCourseById } from '../../hooks/useCourses';
import { useGetSections } from '../../hooks/useSections';
import { useGetLessons } from '../../hooks/useLessons';
import { useCurrentAccount } from '../../hooks/useAuth';
import { storageService } from '../../services/appwrite/storage/storageService';
import {
    ChevronLeft,
    Clock,
    Globe,
    ShieldCheck,
    Trophy,
    Play,
    PlayCircle,
    Lock,
    User,
    Calendar
} from 'lucide-react';

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: account } = useCurrentAccount();

    // ── Data Fetching ──
    const { data: course, isLoading: courseLoading } = useGetCourseById(id!);
    const { data: sections, isLoading: sectionsLoading } = useGetSections(id!);

    // We'll fetch lessons for the first section as a preview if needed
    const firstSectionId = sections?.documents[0]?.$id;
    const { data: previewLessons } = useGetLessons(firstSectionId || '');

    if (courseLoading || sectionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold text-sm tracking-tight">Loading Course Details...</p>
                </div>
            </div>
        );
    }

    if (!course || (!course.is_published && course.teacher_id !== account?.$id)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-black text-slate-900">Course Not Found</h2>
                <Link to="/courses" className="mt-4 text-blue-600 font-bold hover:underline">Return to Catalog</Link>
            </div>
        );
    }

    const thumbnailUrl = course.thumbnail_id
        ? storageService.getFilePreview(course.thumbnail_id)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200';

    return (
        <div className="flex flex-col gap-10">
            {/* Breadcrumb / Back Navigation */}
            <Link to="/courses" className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors w-fit">
                <div className="p-1.5 rounded-lg group-hover:bg-slate-100 transition-colors">
                    <ChevronLeft size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Back to Courses</span>
            </Link>

            {/* Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: Info */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="flex flex-wrap gap-2">
                        {course.categories?.map(cat => (
                            <span key={cat} className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                        {course.title}
                    </h1>

                    <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">
                        {course.description || "Master these skills with hands-on projects and expert guidance. This comprehensive curriculum covers everything you need to succeed."}
                    </p>

                    <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructor</p>
                                <p className="text-sm font-bold text-slate-800">Industry Expert</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                                <Clock size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                                <p className="text-sm font-bold text-slate-800">{Math.round(course.duration ? course.duration / 60 : 0)} hours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                                <Globe size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Language</p>
                                <p className="text-sm font-bold text-slate-800">English</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Preview Card */}
                <div className="lg:col-span-5 sticky top-28">
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
                        <div className="aspect-video relative group">
                            <img src={thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <div className="bg-white p-4 rounded-full text-blue-600 shadow-xl">
                                    <Play size={24} fill="currentColor" />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 flex flex-col gap-6">
                            <div className="flex items-end gap-2">
                                <span className="text-4xl font-black text-slate-900">
                                    {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                                </span>
                                {course.price > 0 && <span className="text-sm font-bold text-slate-400 line-through mb-1.5">$199.99</span>}
                            </div>

                            <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]">
                                Enroll and Start Learning
                            </button>

                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                    <ShieldCheck size={18} className="text-emerald-500" />
                                    Full Lifetime Access
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                    <Trophy size={18} className="text-amber-500" />
                                    Certificate of Completion
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                    <Calendar size={18} className="text-blue-500" />
                                    Regular Content Updates
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Architecture (Curriculum) */}
            <div className="max-w-4xl py-6 flex flex-col gap-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Course Curriculum</h2>
                    <p className="text-slate-400 text-sm font-medium">Browse the structure and lessons included in this masterclass.</p>
                </div>

                <div className="space-y-4">
                    {sections?.documents.map((section, idx) => (
                        <div key={section.$id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-400">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <h3 className="font-bold text-slate-800">{section.title}</h3>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 Lessons</span>
                            </div>

                            {/* Static Lesson List Mockup for now */}
                            <div className="divide-y divide-slate-50">
                                {idx === 0 && previewLessons?.documents.map((lesson) => (
                                    <div key={lesson.$id} className="p-4 pl-16 flex items-center justify-between group hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle size={16} className="text-slate-300 group-hover:text-blue-500" />
                                            <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{lesson.title}</span>
                                        </div>
                                        <Lock size={14} className="text-slate-200" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {sections?.total === 0 && (
                        <div className="p-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <h3 className="font-bold text-slate-400">No curriculum content yet.</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
