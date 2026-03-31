import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        variant = 'primary',
        isLoading = false,
        disabled,
        children,
        className = '',
        leftIcon,
        rightIcon,
        ...props
    }, ref) => {
        const variants = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm disabled:bg-blue-400',
            secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm disabled:bg-slate-700',
            outline: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 disabled:opacity-50',
            danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-sm disabled:bg-rose-400',
            ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 disabled:opacity-50'
        };

        const activeVariant = variants[variant];

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
                    inline-flex items-center justify-center rounded-xl px-5 py-2.5 
                    text-sm font-semibold transition-all duration-200 
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95
                    ${activeVariant}
                    ${className}
                `}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                )}
                {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
