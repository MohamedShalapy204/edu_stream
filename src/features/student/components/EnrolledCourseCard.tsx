import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlay, HiCube, HiOutlineClock, HiOutlineCheckCircle } from 'react-icons/hi2';
import { storageService } from '@/services/appwrite/storage/storageService';
import { type ICourse } from '@/features/courses';
import type { IEnrolledCourse, ICourseProgress } from '../types';
import type { IVodafoneEnrollment } from '@/features/payment/types';
import EnrollmentStatusBadge from '@/features/payment/components/EnrollmentStatusBadge';

interface EnrolledCourseCardProps {
    enrolledCourse: {
        subscription: IEnrolledCourse['subscription'] | null;
        course: ICourse;
    };
    progress?: ICourseProgress;
    vodafoneEnrollment?: IVodafoneEnrollment;
}

export const EnrolledCourseCard: FC<EnrolledCourseCardProps> = ({ enrolledCourse, progress, vodafoneEnrollment }) => {
    const { course, subscription } = enrolledCourse;
    const completedCount = progress?.completed_lessons?.length || 0;
    const isPending = vodafoneEnrollment?.status === 'pending';
    const isDenied = vodafoneEnrollment?.status === 'denied';
    const isEnrolled = !!subscription;

    // Estimated total lessons (fallback to completedCount + 5 if unknown)
    const totalLessons = (progress as { total_lessons?: number } | undefined)?.total_lessons || Math.max(completedCount + 5, 10);
    const progressPercent = isEnrolled && completedCount > 0
        ? Math.min(Math.round((completedCount / totalLessons) * 100), 100)
        : 0;

    return (
        <div className={`bg-base-100 p-6 rounded-4xl shadow-premium hover:shadow-2xl transition-all duration-500 group relative border border-base-content/5 flex flex-col h-full overflow-hidden ${isDenied ? 'opacity-75' : ''}`}>

            {/* Colored left accent bar — emerald for enrolled, amber for pending, rose for denied */}
            <div className={`absolute left-0 top-6 bottom-6 w-0.5 rounded-r-full transition-all duration-300 ${
                isDenied
                    ? 'bg-error/60'
                    : isPending
                        ? 'bg-warning/60'
                        : isEnrolled
                            ? 'bg-accent/60 group-hover:bg-accent'
                            : 'bg-base-content/10'
            }`} />

            {/* Thumbnail */}
            <div className="w-full h-48 bg-base-200 rounded-3xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 border border-base-content/5 mb-6">
                {course.thumbnail_id ? (
                    <img
                        src={storageService.getFilePreview(course.thumbnail_id)}
                        alt={course.title}
                        loading="lazy"
                        decoding="async"
                        className={`w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out ${isDenied ? 'sepia-[0.5]' : ''}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-base-content/10">
                        <HiCube className="w-20 h-20" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    {vodafoneEnrollment ? (
                        <EnrollmentStatusBadge status={vodafoneEnrollment.status} className="scale-75 origin-top-left" />
                    ) : (
                        <span className="bg-primary text-primary-content text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            Direct Enrollment
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between pl-2">
                <div>
                    <h3 className="text-xl font-heading font-black text-base-content group-hover:text-primary transition-colors duration-300 leading-tight tracking-tight mb-3">
                        {course.title}
                    </h3>
                    <p className="text-sm font-medium text-base-content/50 line-clamp-2 leading-relaxed mb-6">
                        {isDenied
                            ? "Your enrollment request for this curriculum was denied. Please contact support or verify your transaction details."
                            : course.description || 'Continue your scholarly pursuit in this curated curriculum segment.'
                        }
                    </p>
                </div>

                <div className="mt-auto">
                    {/* Progress bar — emerald, only for enrolled students with progress */}
                    {isEnrolled && completedCount > 0 && (
                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 text-accent">
                                    <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">{completedCount} Modules Complete</span>
                                </div>
                                <span className="text-[9px] font-black text-accent">{progressPercent}%</span>
                            </div>
                            <div className="h-1.5 bg-base-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent rounded-full transition-all duration-700"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-5 px-1 py-2 border-t border-b border-primary/5">
                        <div className="flex items-center gap-2 text-base-content/40">
                            <HiOutlineClock className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                {subscription
                                    ? `Joined ${new Date(subscription.$createdAt).toLocaleDateString()}`
                                    : `Updated ${new Date(vodafoneEnrollment?.$updatedAt || '').toLocaleDateString()}`
                                }
                            </span>
                        </div>
                    </div>

                    {isEnrolled ? (
                        <Link
                            to={`/student/learn/${course.$id}`}
                            className="w-full h-12 bg-primary text-primary-content rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all shadow-lg active:scale-95 duration-200"
                        >
                            <HiOutlinePlay className="w-4 h-4" />
                            Enter Theatre
                        </Link>
                    ) : (
                        <Link
                            to={`/payment/${course.$id}`}
                            className={`w-full h-12 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 duration-200 ${
                                isPending
                                    ? 'bg-warning/10 text-warning border border-warning/25 hover:bg-warning/20 hover:shadow-warning/15'
                                    : 'bg-error/10 text-error border border-error/25 hover:bg-error/20 hover:shadow-error/15'
                            }`}
                        >
                            <HiOutlinePlay className="w-4 h-4" />
                            {isPending ? 'Check Payment Status' : 'View Rejection Details'}
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};
