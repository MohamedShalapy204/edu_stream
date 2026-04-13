import React from 'react';
import { VodafoneEnrollmentStatus } from '../types';
import { HiOutlineClock, HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi2';

interface EnrollmentStatusBadgeProps {
    status: VodafoneEnrollmentStatus;
    className?: string;
}

const EnrollmentStatusBadge: React.FC<EnrollmentStatusBadgeProps> = ({ status, className = '' }) => {
    switch (status) {
        case VodafoneEnrollmentStatus.PENDING:
            return (
                <div className={`flex items-center gap-2 px-5 py-2.5 bg-warning/10 text-warning-content rounded-full border border-warning/20 shadow-sm animate-pulse ${className}`}>
                    <HiOutlineClock className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Pending Review</span>
                </div>
            );
        case VodafoneEnrollmentStatus.APPROVED:
            return (
                <div className={`flex items-center gap-2 px-5 py-2.5 bg-success/10 text-success-content rounded-full border border-success/20 shadow-sm ${className}`}>
                    <HiOutlineCheckCircle className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Enrolled Active</span>
                </div>
            );
        case VodafoneEnrollmentStatus.DENIED:
            return (
                <div className={`flex items-center gap-2 px-5 py-2.5 bg-destructive/10 text-destructive-content rounded-full border border-destructive/20 shadow-sm ${className}`}>
                    <HiOutlineXCircle className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Enrollment Denied</span>
                </div>
            );
        default:
            return null;
    }
};

export default EnrollmentStatusBadge;
