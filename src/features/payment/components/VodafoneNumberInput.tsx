import React from 'react';
import type { UseFormRegisterReturn, FieldError } from 'react-hook-form';
import { HiOutlineDevicePhoneMobile } from 'react-icons/hi2';

interface VodafoneNumberInputProps {
    label?: string;
    register: UseFormRegisterReturn;
    error?: FieldError;
    placeholder?: string;
    description?: string;
}

const VodafoneNumberInput: React.FC<VodafoneNumberInputProps> = ({
    label = 'Vodafone Cash Number',
    register,
    error,
    placeholder = '010XXXXXXXX',
    description,
}) => {
    return (
        <div className="space-y-3">
            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">
                {label}
            </label>
            <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                    <HiOutlineDevicePhoneMobile className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`input input-bordered h-14 rounded-2xl bg-surface-50 border-none focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-base font-semibold w-full pl-12 ${error ? 'ring-2 ring-destructive/20' : ''
                        }`}
                    {...register}
                />
            </div>
            {error ? (
                <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">
                    {error.message}
                </p>
            ) : (
                description && (
                    <p className="text-[10px] font-medium text-muted-foreground ml-1 italic">
                        {description}
                    </p>
                )
            )}
        </div>
    );
};

export default VodafoneNumberInput;
