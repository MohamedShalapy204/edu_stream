import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    HiOutlineChevronLeft,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineCheckBadge,
    HiOutlineTrophy,
    HiOutlinePlay,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineCalendar
} from 'react-icons/hi2';
import { useGetCourseById } from '@/features/courses';
import { useGetSections } from '@/hooks/useSections';
import { useGetLessons } from '@/hooks/useLessons';
import { useCurrentAccount } from '@/features/auth';
import { storageService } from '@/services/appwrite/storage/storageService';

const CourseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: account } = useCurrentAccount();

    // ── Data Fetching ──
    const { data: course, isLoading: courseLoading } = useGetCourseById(id!);
    const { data: sections, isLoading: sectionsLoading } = useGetSections(id!);

    // Fetch lessons for the first section as a preview if needed
    const firstSectionId = sections?.documents[0]?.$id;
    const { data: previewLessons } = useGetLessons(firstSectionId || '');

    // TODO: Add loading skeleton
    if (courseLoading || sectionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin" />
                    <p className="text-base-content/40 font-black text-xs uppercase tracking-[0.2em]">Synchronizing Records...</p>
                </div>
            </div>
        );
    }

    if (!course || (!course.is_published && course.teacher_id !== account?.$id)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
                <div className="w-20 h-20 bg-error/5 rounded-[2.5rem] flex items-center justify-center text-error/30">
                    <span className="text-4xl font-black">?</span>
                </div>
                <div>
                    <h2 className="text-3xl font-heading font-black text-base-content tracking-tight">Wisdom Not Found</h2>
                    <p className="text-sm font-medium text-base-content/40 mt-2">The record you are seeking does not exist in the Atheneum.</p>
                </div>
                <Link
                    to="/courses"
                    className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl ring-1 ring-white/20 transition-all active:scale-95"
                >
                    Return to Catalog
                </Link>
            </div>
        );
    }

    const thumbnailUrl = course.thumbnail_id
        ? storageService.getFilePreview(course.thumbnail_id)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80';

    return (
        <div className="container mx-auto px-6 lg:px-12 py-12 animate-in fade-in duration-1000">

            {/* Breadcrumb / Back Navigation */}
            <Link to="/courses" className="group inline-flex items-center gap-3 text-base-content/30 hover:text-primary transition-all mb-12">
                <div className="p-2 rounded-xl group-hover:bg-primary/5 transition-colors">
                    <HiOutlineChevronLeft className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Records</span>
            </Link>

            {/* Heritage Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                {/* Left Column: Scholarly Discourse */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="flex flex-wrap gap-2">
                        {course.categories?.map(cat => (
                            <span key={cat} className="px-4 py-1.5 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.15em] rounded-lg border border-primary/10 shadow-sm">
                                {cat}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-5xl md:text-6xl font-heading font-black text-base-content leading-[1.05] tracking-tighter">
                        {course.title}
                    </h1>

                    <p className="text-base-content/50 text-lg font-medium leading-relaxed max-w-2xl border-l-[3px] border-primary/10 pl-6 py-2">
                        {course.description || "Engage in a profound study of this domain through structured curriculum and expert oversight."}
                    </p>

                    <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-base-content/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-base-200/50 rounded-2xl flex items-center justify-center text-base-content/20 shadow-premium">
                                <HiOutlineUser className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-base-content/30 uppercase tracking-widest">Instructor</p>
                                <p className="text-sm font-black text-base-content/80">Academic Expert</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-base-200/50 rounded-2xl flex items-center justify-center text-base-content/20 shadow-premium">
                                <HiOutlineClock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-base-content/30 uppercase tracking-widest">Temporal Study</p>
                                <p className="text-sm font-black text-base-content/80">{course.duration ? Math.round(course.duration / 60) : 'Undefined'} Hours</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-base-200/50 rounded-2xl flex items-center justify-center text-base-content/20 shadow-premium">
                                <HiOutlineGlobeAlt className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-base-content/30 uppercase tracking-widest">Language</p>
                                <p className="text-sm font-black text-base-content/80">{course.language ?? 'Undefined'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Acquisition Card */}
                <div className="lg:col-span-5 sticky top-28">
                    <div className="bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-premium overflow-hidden ring-1 ring-base-content/5">
                        <div className="aspect-video relative group">
                            <img src={thumbnailUrl} alt={course.title} className="w-full h-full object-cover grayscale-10" />
                            <div className="absolute inset-0 bg-base-content/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-primary shadow-2xl"
                                >
                                    <HiOutlinePlay className="w-6 h-6 ml-1" />
                                </motion.div>
                            </div>
                        </div>

                        <div className="p-10 flex flex-col gap-8">
                            <div className="flex items-end gap-3">
                                <span className="text-5xl font-black text-base-content tracking-tighter">
                                    {course.price === 0 ? 'FREE' : `$${course.price.toFixed(2)}`}
                                </span>
                                {course.price > 0 && <span className="text-sm font-bold text-base-content/20 line-through mb-2">$199.99</span>}
                            </div>

                            <button className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-primary/20 ring-1 ring-white/20 active:scale-[0.98]">
                                Enroll and Begin Mastery
                            </button>

                            <div className="space-y-5 pt-4">
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-base-content/40">
                                    <HiOutlineCheckBadge className="w-5 h-5 text-success/60" />
                                    Full Lifetime Access
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-base-content/40">
                                    <HiOutlineTrophy className="w-5 h-5 text-amber-500/60" />
                                    Credential of Achievement
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-base-content/40">
                                    <HiOutlineCalendar className="w-5 h-5 text-primary/60" />
                                    Permanent Content Updates
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Architecture Ledger (Curriculum) */}
            <div className="max-w-4xl mt-32 py-12 flex flex-col gap-12">
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/10"
                    >
                        Academic Architecture
                    </motion.div>
                    <h2 className="text-4xl font-heading font-black text-base-content tracking-tighter">Course Curriculum</h2>
                    <p className="text-base-content/40 text-sm font-medium leading-relaxed max-w-xl">Explore the specialized modules and scholarly nodes contained within this study.</p>
                </div>

                <div className="space-y-6">
                    {sections?.documents.map((section, idx) => (
                        <div key={section.$id} className="bg-white/40 backdrop-blur-xl border border-white shadow-premium rounded-[2.5rem] overflow-hidden group hover:border-primary/10 transition-colors">
                            <div className="p-8 bg-base-200/20 border-b border-base-content/5 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <span className="w-10 h-10 flex items-center justify-center bg-white border border-base-content/5 rounded-xl text-xs font-black text-base-content/30 shadow-sm">
                                        {(idx + 1).toString().padStart(2, '0')}
                                    </span>
                                    <h3 className="text-xl font-heading font-black text-base-content/80 group-hover:text-primary transition-colors">{section.title}</h3>
                                </div>
                                <span className="text-[9px] font-black text-base-content/30 uppercase tracking-[0.2em]">Curriculum Module</span>
                            </div>

                            <div className="divide-y divide-base-content/5">
                                {idx === 0 && previewLessons?.documents.map((lesson) => (
                                    <div key={lesson.$id} className="p-6 pl-24 flex items-center justify-between group/lesson hover:bg-primary/20 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-primary/40 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                                                <HiOutlinePlay className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-base-content/60 group-hover/lesson:text-base-content transition-colors">{lesson.title}</span>
                                        </div>
                                        <HiOutlineLockClosed className="w-4 h-4 text-base-content/10 group-hover/lesson:text-primary/20 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {sections?.total === 0 && (
                        <div className="p-20 text-center bg-white/50 backdrop-blur-xl rounded-[3rem] border border-dashed border-base-content/10">
                            <h3 className="font-black text-base-content/20 uppercase tracking-widest text-xs">Awaiting Curriculum Records</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;
