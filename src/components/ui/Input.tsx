import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelRight?: React.ReactNode;
    error?: string;
    icon?: React.ReactNode;
    trailing?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, labelRight, error, icon, trailing, className = '', ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {(label || labelRight) && (
                    <div className="flex justify-between items-center ml-0.5">
                        {label && (
                            <label className="text-[10px] tracking-[0.2em] font-bold text-[#adb3b8]">
                                {label}
                            </label>
                        )}
                        {labelRight && <div className="text-xs">{labelRight}</div>}
                    </div>
                )}

                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#adb3b8] group-focus-within:text-[#4e45e4] transition-colors duration-300">
                            {icon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={`
                            w-full h-12 bg-[#f1f4f8] rounded-2xl
                            px-5 text-sm font-medium text-[#1e1e1e] placeholder:text-[#adb3b8]
                            border border-transparent
                            focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#4e45e4]/5 focus:border-[#4e45e4]/10
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all duration-300
                            ${icon ? 'pl-11' : ''}
                            ${trailing ? 'pr-11' : ''}
                            ${error ? 'bg-rose-50/50 focus:ring-rose-500/5 focus:border-rose-500/10 text-rose-900 placeholder:text-rose-300' : ''}
                            ${className}
                        `}
                        {...props}
                    />

                    {trailing && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                            {trailing}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1 uppercase tracking-wider animate-in fade-in slide-in-from-top-1">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
