import React, { useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { createPortal } from 'react-dom';

interface ReceiptImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

const ReceiptImageModal: React.FC<ReceiptImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
    // Prevent background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0 z-0" onClick={onClose}></div>
            <div className="relative z-10 max-w-4xl w-full bg-surface-50 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] border border-white/10">
                <div className="flex justify-between items-center p-6 border-b border-muted/10 bg-white">
                    <h3 className="font-black text-xl tracking-tight">Transaction Receipt</h3>
                    <button onClick={onClose} className="p-3 bg-base-200/50 hover:bg-base-200 rounded-full transition-colors active:scale-95">
                        <HiOutlineXMark className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-auto bg-surface-100 flex-1 flex items-center justify-center">
                    <img src={imageUrl} alt="Receipt" className="max-w-full rounded-3xl object-contain min-h-[300px] shadow-sm ring-1 ring-muted/10" />
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReceiptImageModal;
