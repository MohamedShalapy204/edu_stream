import React from 'react';
import { motion } from 'motion/react';
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
    const thumbnailUrl = course.thumbnail_url || (course.thumbnail_id
        ? storageService.getFilePreview(course.thumbnail_id)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60');


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="group relative"
        >
            <Link to={`/courses/${course.$id}`} className="block h-full">
                <div className="relative h-full flex flex-col bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 shadow-premium overflow-hidden transition-all duration-500 group-hover:shadow-2xl group-hover:border-primary/20">

                    {/* Visual Anchor (Thumbnail) */}
                    <div className="relative aspect-16/10 overflow-hidden">
                        <img
                            src={thumbnailUrl}
                            alt={course.title}
                            className="w-full h-full object-cover grayscale-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        {/* Price Badge */}
                        <div className="absolute bottom-4 right-4 px-4 py-1.5 bg-primary/90 backdrop-blur-md text-white text-xs font-black rounded-xl shadow-lg ring-1 ring-white/20">
                            {course.price === 0 ? 'COMPLIMENTARY' : `$${course.price.toFixed(2)}`}
                        </div>

                        {/* Category Tag */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {course.categories?.slice(0, 1).map((cat) => (
                                <span key={cat} className="px-3 py-1 bg-white/90 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.15em] text-base-content/70 rounded-lg border border-white/30 shadow-sm">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Content Ledger */}
                    <div className="p-8 flex flex-col grow">
                        <h3 className="text-xl font-heading font-black text-base-content leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                        </h3>

                        <p className="text-xs font-medium leading-relaxed text-base-content/50 line-clamp-2 mb-8">
                            {course.description || 'Access a curated domain of knowledge through this specialized scholarly study.'}
                        </p>

                        {/* Scholarly Metadata */}
                        <div className="mt-auto pt-6 flex items-center justify-between border-t border-base-content/5">
                            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-base-content/30">
                                <div className="flex items-center gap-1.5 group-hover:text-primary/60 transition-colors">
                                    <HiOutlineUsers className="w-4 h-4" />
                                    <span>{course.total_students || 0} Learners</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <HiOutlineBookOpen className="w-4 h-4" />
                                    <span>Core Lessons</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/5 border border-amber-400/10">
                                <HiStar className="w-3 h-3 text-amber-500" />
                                <span className="text-xs font-black text-amber-600/80">{course.rating || '4.8'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
