import React from 'react';
import { Link } from 'react-router-dom';
import type { ICourse } from '../../types';
import { storageService } from '../../services/appwrite/storage/storageService';
import { BookOpen, Star, Users } from 'lucide-react';

interface CourseCardProps {
    course: ICourse;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const thumbnailUrl = course.thumbnail_id
        ? storageService.getFilePreview(course.thumbnail_id)
        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';

    return (
        <Link
            to={`/courses/${course.$id}`}
            className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
        >
            {/* Thumbnail Header */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges Overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {course.categories?.slice(0, 1).map((cat) => (
                        <span key={cat} className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-slate-800 rounded-full border border-white/20 shadow-sm">
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Price Overlay */}
                <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20">
                    {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                    {course.title}
                </h3>

                <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {course.description || 'No description provided for this course.'}
                </p>

                {/* Meta Information */}
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100">
                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-slate-300" />
                            <span>{course.total_students || 0} Students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <BookOpen size={14} className="text-slate-300" />
                            <span>8 Lessons</span> {/* Static for now */}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-700">{course.rating || '4.8'}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};
