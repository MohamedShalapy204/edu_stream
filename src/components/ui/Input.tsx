import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-medium text-slate-700 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`
                            w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white
                            text-slate-900 placeholder:text-slate-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                            disabled:opacity-50 disabled:bg-slate-50
                            transition-all duration-200
                            ${icon ? 'pl-10' : ''}
                            ${error ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500' : ''}
                            ${className}
                        `}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs font-medium text-rose-500 ml-1 animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
