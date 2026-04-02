import React, { forwardRef } from 'react';
import type { ElementType } from 'react';

interface ButtonProps<T extends ElementType = 'button'> {
    as?: T;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
}

const Button = forwardRef(<T extends ElementType = 'button'>(
    {
        as,
        variant = 'primary',
        isLoading = false,
        leftIcon,
        rightIcon,
        className = '',
        children,
        disabled,
        ...props
    }: ButtonProps<T> & React.ComponentPropsWithoutRef<T>,
    ref: React.ForwardedRef<HTMLElement>
) => {
    const Component: ElementType = as || 'button';

    const variants = {
        primary: 'bg-[#4e45e4] text-white hover:bg-[#3d36b8] shadow-lg shadow-[#4e45e4]/20 active:shadow-none active:scale-95',
        secondary: 'bg-[#f1f4f8] text-[#2d3338] hover:bg-[#e8ecf1] active:bg-[#e0e7ff] active:text-[#4e45e4] active:scale-95',
        outline: 'bg-white text-[#2d3338] shadow-[0_4px_16px_rgba(0,0,0,0.02)] border border-[#f1f4f8] hover:border-[#4e45e4]/20 hover:text-[#4e45e4] active:scale-95',
        danger: 'bg-rose-50 text-rose-600 hover:bg-rose-100/80 active:bg-rose-200 active:scale-95',
        ghost: 'bg-transparent text-[#adb3b8] hover:text-[#4e45e4] hover:bg-[#4e45e4]/5 active:bg-[#4e45e4]/10 active:scale-95'
    };

    const activeVariant = variants[variant];

    return (
        <Component
            ref={ref}
            disabled={disabled || isLoading}
            className={`
                inline-flex items-center justify-center rounded-2xl h-12 px-6
                text-xs font-black uppercase tracking-widest text-center
                transition-all duration-300 select-none
                focus:outline-none focus:ring-4 focus:ring-[#4e45e4]/5
                disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
                ${activeVariant}
                ${className}
            `}
            {...props}
        >
            {isLoading && (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            )}
            {!isLoading && leftIcon && <div className="mr-2.5 transition-transform group-hover:-translate-x-0.5">{leftIcon}</div>}
            <span>{children}</span>
            {!isLoading && rightIcon && <div className="ml-2.5 transition-transform group-hover:translate-x-0.5">{rightIcon}</div>}
        </Component>
    );
});

Button.displayName = 'Button';

export default Button;
