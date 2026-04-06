import React from 'react';
import { Link } from 'react-router-dom';
import { HiPlus, HiCube, HiOutlinePencil, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { storageService } from '@/services/appwrite/storage/storageService';
import type { ICourse } from '../../courses';

interface CourseListProps {
    courses: ICourse[];
}

/**
 * 🎓 CourseList
 * 
 * An editorial-style ledger for managing course records.
 */
export const CourseList: React.FC<CourseListProps> = ({ courses }) => {
    if (!courses || courses.length === 0) {
        return (
            <div className="bg-white/40 backdrop-blur-3xl rounded-4xl p-32 text-center shadow-premium border border-dashed border-base-content/10 transition-all">
                <div className="bg-primary/5 p-10 h-24 w-24 rounded-4xl inline-flex items-center justify-center mb-8 text-primary/30">
                    <HiPlus className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-heading font-black text-base-content mb-3 tracking-tight italic">The archives are silent.</h3>
                <p className="text-base-content/40 text-base font-medium mb-12 max-w-xs mx-auto leading-relaxed">Your intellectual contributions are awaiting their first chapter.</p>
                <Link
                    to="/teacher/courses/new"
                    className="inline-flex items-center px-10 py-4 bg-white text-base-content font-black text-[10px] uppercase tracking-widest hover:bg-base-100 shadow-premium rounded-2xl transition-all active:scale-95 border border-base-content/5"
                >
                    Initiate New Course
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {courses.map((course) => (
                <div
                    key={course.$id}
                    className="bg-white/40 backdrop-blur-3xl p-8 rounded-4xl shadow-premium hover:shadow-2xl transition-all duration-500 group relative border border-transparent hover:border-primary/10 ring-1 ring-base-content/5"
                >
                    <div className="flex flex-col sm:flex-row gap-8">
                        <div className="w-full sm:w-44 h-36 bg-base-200/50 rounded-4xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 shadow-inner border border-white/40">
                            {course.thumbnail_id ? (
                                <img
                                    src={storageService.getFilePreview(course.thumbnail_id)}
                                    alt={course.title}
                                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-base-content/10">
                                    <HiCube className="w-16 h-16" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                {course.is_published ? (
                                    <span className="bg-success text-white text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-success/20 ring-1 ring-white/20">Active</span>
                                ) : (
                                    <span className="bg-base-content/40 text-black text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg ring-1 ring-white/20">Draft</span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex items-start justify-between gap-5 mb-4">
                                <h3 className="text-2xl font-heading font-black text-base-content truncate group-hover:text-primary transition-colors leading-tight tracking-tight">
                                    {course.title}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/teacher/courses/${course.$id}`}
                                        className="w-10 h-10 flex items-center justify-center text-base-content/20 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-base-content/5"
                                    >
                                        <HiOutlinePencil className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to={`/courses/${course.$id}`}
                                        target="_blank"
                                        className="w-10 h-10 flex items-center justify-center text-base-content/20 hover:text-primary hover:bg-primary/5 rounded-xl transition-all border border-base-content/5"
                                    >
                                        <HiOutlineArrowTopRightOnSquare className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-base-content/40 line-clamp-2 mb-8 leading-relaxed">
                                {course.description || 'Access a curated domain of knowledge through this specialized scholarly study.'}
                            </p>
                            <div className="mt-auto flex items-center gap-8 justify-between border-t border-base-content/5 pt-6">
                                <div>
                                    <p className="text-[8px] font-black text-base-content/30 uppercase tracking-[0.2em] mb-1">Learners</p>
                                    <p className="text-sm font-black text-base-content/80 group-hover:text-primary transition-colors">{course.total_students || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-base-content/30 uppercase tracking-[0.2em] mb-1">Acquisition</p>
                                    <p className="text-sm font-black text-base-content/80">${course.price || 0}</p>
                                </div>
                                <div className="px-3 py-1 rounded-lg bg-amber-400/5 border border-amber-400/10">
                                    <p className="text-[8px] font-black text-amber-600/40 uppercase tracking-[0.2em] mb-1 text-center">Mastery</p>
                                    <p className="text-sm font-black text-amber-600/80 text-center">{course.rating || '4.8'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
