import React from 'react';
import { HiXCircle, HiInformationCircle, HiCheckCircle, HiExclamation } from 'react-icons/hi';

interface AlertProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    message: string;
    onClose?: () => void;
    className?: string; // Support custom spacing or placement
}

const Alert: React.FC<AlertProps> = ({ type = 'info', message, onClose, className = '' }) => {
    const configs = {
        info: {
            bg: 'bg-blue-50 border-blue-200',
            text: 'text-blue-800',
            icon: <HiInformationCircle className="h-5 w-5 text-blue-400" />
        },
        success: {
            bg: 'bg-green-50 border-green-200',
            text: 'text-green-800',
            icon: <HiCheckCircle className="h-5 w-5 text-green-400" />
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200',
            text: 'text-amber-800',
            icon: <HiExclamation className="h-5 w-5 text-amber-400" />
        },
        error: {
            bg: 'bg-rose-50 border-rose-200',
            text: 'text-rose-800',
            icon: <HiXCircle className="h-5 w-5 text-rose-400" />
        }
    };

    const config = configs[type];

    return (
        <div className={`
            flex p-4 mb-4 text-sm rounded-xl border animate-in slide-in-from-top-1 fade-in duration-200
            ${config.bg} ${config.text}
            ${className}
        `}>
            <div className="shrink-0 mr-3 mt-0.5">
                {config.icon}
            </div>
            <div className="grow font-medium leading-relaxed text-left">
                {message}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="ml-auto -mx-1.5 -my-1.5 bg-transparent p-1.5 rounded-lg hover:bg-slate-200/50 inline-flex items-center justify-center h-8 w-8 text-current focus:outline-none focus:ring-2 focus:ring-current/20 transition-colors"
                >
                    <HiXCircle className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default Alert;
