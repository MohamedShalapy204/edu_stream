import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HiOutlineBookOpen, HiStar, HiOutlineUsers } from 'react-icons/hi2';
import type { ICourse } from '../types/courseTypes';
import { storageService } from '@/services/appwrite/storage/storageService';

interface CourseCardProps {
    course: ICourse;
}

/**
 * 🎓 CourseCard
 *
 * A high-fidelity, glassmorphic card for displaying course information.
 * Features a "Scholarly Tile" aesthetic with buttery-smooth hover states.
 */
export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { t } = useTranslation();
    const thumbnailUrl = course.thumbnail_url || (course.thumbnail_id
        ? storageService.getFilePreview(course.thumbnail_id)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="group relative"
        >
            <Link to={`/courses/${course.$id}`} viewTransition className="block h-full">
                <div className="relative h-full flex flex-col bg-base-100 rounded-[2.5rem] border border-base-content/10 shadow-premium overflow-hidden transition-[transform,shadow,border-color] duration-500 group-hover:shadow-2xl group-hover:border-primary/25 group-hover:-translate-y-2">

                    {/* Visual Anchor (Thumbnail) */}
                    <div className="relative aspect-16/10 overflow-hidden" style={{ viewTransitionName: `course-thumbnail-${course.$id}` } as React.CSSProperties}>
                        <img
                            src={thumbnailUrl}
                            alt={course.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-70" />

                        {/* Price Badge — Solid, not glass */}
                        <div className="absolute bottom-4 right-4 px-4 py-1.5 bg-primary text-primary-content text-xs font-black rounded-xl shadow-lg">
                            {course.price === 0 ? t('courses.card.complimentary') : `EGP ${course.price.toFixed(0)}`}
                        </div>

                        {/* Category Tag — Solid background */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {course.categories?.slice(0, 1).map((cat) => (
                                <span
                                    key={cat}
                                    className="px-3 py-1 bg-base-100/90 text-[9px] font-black uppercase tracking-[0.15em] text-base-content rounded-lg shadow-sm"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Content Ledger */}
                    <div className="p-6 md:p-8 flex flex-col grow">
                        <h3 className="text-xl font-heading font-black text-base-content leading-tight mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                            {course.title}
                        </h3>

                        <p className="text-xs font-medium leading-relaxed text-base-content/50 line-clamp-2 mb-8">
                            {course.description || t('courses.card.defaultDescription')}
                        </p>

                        {/* Scholarly Metadata */}
                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-base-content/5">
                            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-base-content/30">
                                <div className="flex items-center gap-1.5 group-hover:text-primary/70 transition-colors duration-300">
                                    <HiOutlineUsers className="w-4 h-4" />
                                    <span>{course.total_students || 0} {t('courses.card.learners')}</span>
                                </div>
                                <div className="flex items-center gap-1.5 group-hover:text-primary/50 transition-colors duration-300">
                                    <HiOutlineBookOpen className="w-4 h-4" />
                                    <span>{t('courses.card.coreLessons')}</span>
                                </div>
                            </div>

                            {/* Rating — Solid semantic tag */}
                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-warning/10 border border-warning/15">
                                <HiStar className="w-3 h-3 text-warning" />
                                <span className="text-xs font-black text-warning">{course.rating || '4.8'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
