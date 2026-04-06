import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlay, HiCube, HiOutlineClock } from 'react-icons/hi2';
import { storageService } from '@/services/appwrite/storage/storageService';
import type { IEnrolledCourse, ICourseProgress } from '../types';

interface EnrolledCourseCardProps {
    enrolledCourse: IEnrolledCourse;
    progress?: ICourseProgress;
}

export const EnrolledCourseCard: FC<EnrolledCourseCardProps> = ({ enrolledCourse, progress }) => {
    const { course, subscription } = enrolledCourse;
    const completedCount = progress?.completed_lessons?.length || 0;

    return (
        <div className="bg-white/40 backdrop-blur-3xl p-6 rounded-4xl shadow-premium hover:shadow-2xl transition-all duration-500 group relative border border-transparent hover:border-primary/10 ring-1 ring-base-content/5 flex flex-col h-full">
            <div className="w-full h-48 bg-base-200/50 rounded-3xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 shadow-inner border border-white/40 mb-6">
                {course.thumbnail_id ? (
                    <img
                        src={storageService.getFilePreview(course.thumbnail_id)}
                        alt={course.title}
                        className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/10">
                        <HiCube className="w-20 h-20" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 text-white backdrop-blur-sm text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg ring-1 ring-white/20 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Enrolled
                    </span>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-heading font-black text-base-content group-hover:text-primary transition-colors leading-tight tracking-tight mb-3">
                        {course.title}
                    </h3>
                    <p className="text-sm font-medium text-base-content/50 line-clamp-2 leading-relaxed mb-6">
                        {course.description || 'Continue your scholarly pursuit in this curated curriculum segment.'}
                    </p>
                </div>

                <div className="mt-auto">
                    <div className="flex items-center justify-between mb-5 px-1 py-2 border-t border-b border-base-content/5">
                        <div className="flex items-center gap-2 text-base-content/40">
                            <HiOutlineClock className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Joined {new Date(subscription.$createdAt).toLocaleDateString()}</span>
                        </div>
                        {completedCount > 0 && (
                            <div className="bg-success/5 border border-success/10 px-2 py-1 rounded-md">
                                <span className="text-[9px] font-black uppercase tracking-widest text-success">{completedCount} Modules Completed</span>
                            </div>
                        )}
                    </div>

                    <Link
                        to={`/student/learn/${course.$id}`}
                        className="w-full h-12 bg-base-content text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors shadow-lg active:scale-95 duration-200"
                    >
                        <HiOutlinePlay className="w-4 h-4" />
                        Enter Theatre
                    </Link>
                </div>
            </div>
        </div>
    );
};
