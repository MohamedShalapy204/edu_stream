import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { HiOutlinePhoto, HiOutlineArrowLeft } from 'react-icons/hi2';
import { useCourseEnrollmentStatus, useSubmitVodafoneReceipt } from '../hooks/useVodafoneEnrollment';
import PaymentInstructionsCard from '../components/PaymentInstructionsCard';
import EnrollmentStatusBadge from '../components/EnrollmentStatusBadge';
import { useGetCourseById } from '@/features/courses/hooks/useCourseActions';
import { useCurrentUser } from '@/hooks/useUser';
import toast from 'react-hot-toast';

const PaymentPage: React.FC = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { data: user } = useCurrentUser();

    const { data: course, isLoading: loadingCourse } = useGetCourseById(courseId || '');
    const { data: enrollmentStatus, isLoading: loadingStatus } = useCourseEnrollmentStatus(courseId || '', user?.$id || '');
    const { mutate: submitReceipt, isPending: isSubmitting } = useSubmitVodafoneReceipt();

    const [receipt, setReceipt] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setReceipt(file);
            setPreview(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    if (loadingCourse || loadingStatus) {
        return <div className="flex justify-center items-center h-64"><span className="loading loading-spinner text-primary"></span></div>;
    }

    if (!course) {
        return <div className="text-center py-20 text-muted-foreground font-semibold">Course not found.</div>;
    }

    // Teacher has not configured payment
    if (!course.vodafone_cash_number) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-8 text-center bg-warning/10 text-warning-content rounded-[2.5rem]">
                <h3 className="font-black text-xl mb-2">Manual Enrollment Unavailable</h3>
                <p>The instructor has not configured a Vodafone Cash number for this course.</p>
                <button className="btn btn-outline outline-warning mt-6" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    const handleSubmit = () => {
        if (!receipt || !user || !courseId) return;

        submitReceipt({
            courseId,
            studentId: user.$id,
            receiptImage: receipt,
            paymentNumberShown: course.vodafone_cash_number || ''
        }, {
            onSuccess: () => {
                toast.success('Receipt submitted successfully. Waiting for instructor verification.');
                setReceipt(null);
                setPreview(null);
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to submit receipt.');
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost bg-surface-50 border-muted/20">
                    <HiOutlineArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">Enrollment Gateway</h1>
                    <p className="text-muted-foreground font-medium">{course.title}</p>
                </div>
            </div>

            {enrollmentStatus && enrollmentStatus.status !== 'denied' ? (
                <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-muted/5 text-center space-y-6">
                    <div className="flex justify-center mb-6">
                        <EnrollmentStatusBadge status={enrollmentStatus.status} className="scale-125" />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Status Update</h3>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                        {enrollmentStatus.status === 'pending' && "Your receipt has been submitted and is currently pending instructor review. You'll receive access once verified."}
                        {enrollmentStatus.status === 'approved' && "Your payment has been verified. You now have full access to the course material."}
                    </p>

                    {enrollmentStatus.status === 'approved' && (
                        <button onClick={() => navigate(`/student/learn/${courseId}`)} className="btn btn-primary mt-6 rounded-2xl px-10 h-14 font-black uppercase tracking-[0.2em] text-xs">
                            Enter Theatre
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                    <div className="flex flex-col gap-6">
                        <PaymentInstructionsCard
                            vodafoneNumber={course.vodafone_cash_number || ''}
                            amount={course.price}
                        />
                        {enrollmentStatus?.status === 'denied' && course.allow_resubmission && (
                            <div className="bg-destructive/10 text-destructive-content p-6 rounded-4xl border border-destructive/20 animate-in slide-in-from-top-2">
                                <h4 className="font-black text-lg tracking-tight flex items-center gap-2 mb-2">
                                    Enrollment Denied
                                </h4>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    The instructor could not verify your previous submission. Please ensure the screenshot clearly shows the transaction ID, date, and amount sent to the correct number, then try again.
                                </p>
                            </div>
                        )}
                        {enrollmentStatus?.status === 'denied' && !course.allow_resubmission && (
                            <div className="bg-destructive/10 text-destructive-content p-6 rounded-4xl border border-destructive/20">
                                <h4 className="font-black text-lg tracking-tight mb-2">Enrollment Denied</h4>
                                <p className="text-sm opacity-90">The instructor has denied your enrollment and resubmissions are disabled for this course.</p>
                            </div>
                        )}
                    </div>

                    {(!enrollmentStatus || (enrollmentStatus.status === 'denied' && course.allow_resubmission)) && (
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-muted/5 space-y-8">
                            <div>
                                <h3 className="text-xl font-black tracking-tight flex items-center gap-2 mb-2">
                                    Receipt Upload
                                </h3>
                                <p className="text-sm text-muted-foreground">Upload the screenshot of your successful transaction.</p>
                            </div>

                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-4xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted/30 hover:border-primary/40 bg-surface-50 hover:bg-surface-100'} ${preview ? 'border-none p-0 overflow-hidden shadow-inner' : ''}`}
                            >
                                <input {...getInputProps()} />

                                {preview ? (
                                    <div className="relative group rounded-4xl overflow-hidden aspect-4/3">
                                        <img src={preview} alt="Receipt preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <p className="text-white font-black tracking-[0.2em] uppercase text-[10px] bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">Click to replace</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-5 group-hover:scale-110 transition-transform">
                                            <HiOutlinePhoto className="w-8 h-8 text-muted-foreground/60" />
                                        </div>
                                        <p className="font-black text-foreground mb-2 text-sm uppercase tracking-wide">Drop receipt here</p>
                                        <p className="text-xs text-muted-foreground font-medium">JPEG, PNG up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={!receipt || isSubmitting}
                                className="btn btn-primary w-full h-14 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all no-animation disabled:opacity-50 disabled:scale-100 border-none"
                            >
                                {isSubmitting ? <span className="loading loading-spinner"></span> : 'Submit Payment Proof'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
