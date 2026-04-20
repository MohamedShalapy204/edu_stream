import { useGetTeacherEnrollments } from '../hooks/useEnrollments';
import { useTranslation } from 'react-i18next';
import type { ICourse } from '@/features/courses/types/courseTypes';
import { HiOutlineUserGroup, HiOutlineEnvelope } from 'react-icons/hi2';

interface EnrollmentLedgerProps {
    courses: ICourse[];
}

export const EnrollmentLedger: React.FC<EnrollmentLedgerProps> = ({ courses }) => {
    const { t, i18n } = useTranslation();
    // Only query if we have active courses
    const courseIds = courses.map(c => c.$id);
    const { data: enrollments, isLoading } = useGetTeacherEnrollments(courseIds);

    if (isLoading) {
        return (
            <div className="bg-base-100 rounded-[3rem] p-8 border border-base-content/5 flex items-center justify-center min-h-[300px]">
                <span className="loading loading-spinner text-primary" />
            </div>
        );
    }

    if (!enrollments || enrollments.length === 0) {
        return (
            <div className="bg-base-100 rounded-[3rem] p-12 text-center border border-base-content/10">
                <div className="bg-primary/5 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                    <HiOutlineUserGroup className="w-10 h-10 text-primary/40" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t('teacher.ledger.noEnrollments')}</h3>
                <p className="text-base-content/50 max-w-sm mx-auto text-sm font-medium">{t('teacher.ledger.emptyLedger')}</p>
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-[3rem] border border-base-content/10 overflow-hidden shadow-premium">
            <div className="p-8 lg:p-10 border-b border-base-content/5">
                <h3 className="text-3xl font-heading font-black tracking-tighter text-base-content">{t('teacher.ledger.title')}</h3>
                <p className="text-base-content/50 font-medium mt-2 max-w-xl">{t('teacher.ledger.subtitle')}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr className="border-base-content/5 text-[10px] uppercase tracking-widest font-black text-base-content/40 bg-base-200/50">
                            <th className="pl-10 py-6">{t('teacher.ledger.scholar')}</th>
                            <th className="py-6">{t('teacher.ledger.enrolledSubject')}</th>
                            <th className="py-6">{t('teacher.ledger.joined')}</th>
                            <th className="pr-10 py-6 text-right">{t('teacher.ledger.status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map(({ subscription, user }) => {
                            const course = courses.find(c => c.$id === subscription.course_id);
                            const joinedDate = new Date(subscription.start_date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
                            return (
                                <tr key={subscription.$id} className="border-base-content/5 hover:bg-base-200/50 transition-colors group">
                                    <td className="pl-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-xl bg-base-200 border border-base-content/5 text-base-content flex items-center justify-center font-black">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.name} className="rounded-xl" />
                                                    ) : user.name.charAt(0).toUpperCase()}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm tracking-tight text-base-content">{user.name}</div>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-base-content/40 font-medium">
                                                    <HiOutlineEnvelope className="w-3.5 h-3.5" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6">
                                        <div className="font-bold text-sm tracking-tight text-base-content/80">{course?.title || t('teacher.ledger.archivedCourse')}</div>
                                    </td>
                                    <td className="py-6 text-sm text-base-content/50 font-medium">{joinedDate}</td>
                                    <td className="pr-10 py-6 text-right">
                                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${subscription.status === 'active'
                                                ? 'bg-success/10 text-success border-success/20'
                                                : 'bg-base-200 text-base-content/50 border-base-content/10'
                                            }`}>
                                            {subscription.status}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
