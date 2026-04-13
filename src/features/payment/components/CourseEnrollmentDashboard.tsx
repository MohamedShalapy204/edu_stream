import React, { useState } from 'react';
import { useGetPendingVodafoneEnrollments, useApproveVodafoneEnrollment, useDenyVodafoneEnrollment } from '@/features/teacher/hooks/useEnrollments';
import { HiOutlineDocumentText, HiOutlineCheckCircle, HiOutlineUser, HiOutlineXMark } from 'react-icons/hi2';
import ReceiptImageModal from './ReceiptImageModal';
import toast from 'react-hot-toast';

interface CourseEnrollmentDashboardProps {
    courseId: string;
}

const CourseEnrollmentDashboard: React.FC<CourseEnrollmentDashboardProps> = ({ courseId }) => {
    const { data: pendingEnrollments, isLoading } = useGetPendingVodafoneEnrollments([courseId]);
    const { mutate: approve, isPending: isApproving } = useApproveVodafoneEnrollment();
    const { mutate: deny, isPending: isDenying } = useDenyVodafoneEnrollment();

    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

    const handleApprove = (enrollmentId: string, studentId: string) => {
        approve(
            { enrollmentId, studentId, courseId },
            {
                onSuccess: () => toast.success('Enrollment securely approved.'),
                onError: (e) => toast.error(e.message || 'Approval failed.')
            }
        );
    };

    const handleDeny = (enrollmentId: string) => {
        if (!window.confirm('Are you sure you want to deny this payment?')) return;
        
        deny(enrollmentId, {
            onSuccess: () => toast.error('Enrollment has been denied.'),
            onError: (e) => toast.error(e.message || 'Denial failed.')
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center p-12">
                <span className="loading loading-spinner text-primary"></span>
            </div>
        );
    }

    if (!pendingEnrollments || pendingEnrollments.length === 0) {
        return (
            <div className="bg-surface-50 rounded-[2.5rem] p-12 text-center border border-muted/10 border-dashed">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <HiOutlineCheckCircle className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <h3 className="font-black text-xl tracking-tight mb-2">No Pending Enrollments</h3>
                <p className="text-muted-foreground text-sm">All Vodafone Cash submissions have been processed for this course.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-2xl tracking-tight">Pending Confirmations</h3>
                <div className="px-4 py-1.5 bg-warning/10 text-warning-content rounded-full font-black text-[10px] uppercase tracking-widest">
                    {pendingEnrollments.length} Pending
                </div>
            </div>

            <div className="grid gap-4">
                {pendingEnrollments.map((item) => (
                    <div key={item.$id} className="bg-white rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium border border-muted/5 group transition-all hover:border-primary/20">
                        <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-14 h-14 bg-base-200/50 rounded-2xl flex items-center justify-center text-primary overflow-hidden shrink-0 shadow-inner">
                                {item.user.avatar_url ? (
                                    <img src={item.user.avatar_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <HiOutlineUser className="w-6 h-6 text-base-content/20" />
                                )}
                            </div>
                            <div>
                                <p className="font-black text-base">{item.user.name}</p>
                                <p className="text-xs text-muted-foreground font-medium">{item.user.email}</p>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mt-1">
                                    Submitted: {new Date(item.$createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => setSelectedReceipt(item.receipt_image_url)}
                                className="btn btn-ghost bg-surface-50 hover:bg-surface-100 rounded-xl px-6 h-12 flex-1 md:flex-none text-xs font-bold"
                            >
                                <HiOutlineDocumentText className="w-5 h-5 mr-2" />
                                View Receipt
                            </button>
                            <button 
                                onClick={() => handleApprove(item.$id, item.student_id)}
                                disabled={isApproving || isDenying}
                                className="btn btn-success hover:bg-success/90 text-white rounded-xl px-6 h-12 flex-1 md:flex-none text-xs font-black shadow-lg shadow-success/20 outline-none border-none"
                            >
                                <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                                Approve
                            </button>
                            <button 
                                onClick={() => handleDeny(item.$id)}
                                disabled={isApproving || isDenying}
                                className="btn btn-ghost hover:bg-destructive/10 text-destructive rounded-xl px-4 h-12 flex-1 md:flex-none text-xs font-bold"
                            >
                                <HiOutlineXMark className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <ReceiptImageModal 
                isOpen={!!selectedReceipt} 
                onClose={() => setSelectedReceipt(null)} 
                imageUrl={selectedReceipt || ''} 
            />
        </div>
    );
};

export default CourseEnrollmentDashboard;
