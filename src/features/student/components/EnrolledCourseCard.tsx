import { type FC } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlinePlay, HiCube, HiOutlineClock } from 'react-icons/hi2';
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

    return (
        <div className={`bg-white/40 backdrop-blur-3xl p-6 rounded-4xl shadow-premium hover:shadow-2xl transition-all duration-500 group relative border border-transparent hover:border-primary/10 ring-1 ring-base-content/5 flex flex-col h-full ${isDenied ? 'opacity-80' : ''}`}>
            <div className="w-full h-48 bg-base-200/50 rounded-3xl overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 shadow-inner border border-white/40 mb-6">
                {course.thumbnail_id ? (
                    <img
                        src={storageService.getFilePreview(course.thumbnail_id)}
                        alt={course.title}
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
                        <span className="bg-primary/90 text-white backdrop-blur-sm text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg ring-1 ring-white/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            Direct Enrollment
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-heading font-black text-base-content group-hover:text-primary transition-colors leading-tight tracking-tight mb-3">
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
                    <div className="flex items-center justify-between mb-5 px-1 py-2 border-t border-b border-base-content/5">
                        <div className="flex items-center gap-2 text-base-content/40">
                            <HiOutlineClock className="w-4 h-4" />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                                {subscription
                                    ? `Joined ${new Date(subscription.$createdAt).toLocaleDateString()}`
                                    : `Updated ${new Date(vodafoneEnrollment?.$updatedAt || '').toLocaleDateString()}`
                                }
                            </span>
                        </div>
                        {completedCount > 0 && !isDenied && (
                            <div className="bg-success/5 border border-success/10 px-2 py-1 rounded-md">
                                <span className="text-[9px] font-black uppercase tracking-widest text-success">{completedCount} Modules Completed</span>
                            </div>
                        )}
                    </div>

                    {isEnrolled ? (
                        <Link
                            to={`/student/learn/${course.$id}`}
                            className="w-full h-12 bg-base-content text-white rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-colors shadow-lg active:scale-95 duration-200"
                        >
                            <HiOutlinePlay className="w-4 h-4" />
                            Enter Theatre
                        </Link>
                    ) : (
                        <Link
                            to={`/payment/${course.$id}`}
                            className={`w-full h-12 rounded-2xl flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 duration-200 ${isPending ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20' : 'bg-destructive/10 text-destructive-content border border-destructive/20 hover:bg-destructive/20 text-error'
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
