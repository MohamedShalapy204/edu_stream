import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiUser, HiArrowRight, HiAcademicCap, HiTranslate } from 'react-icons/hi';
import { registerSchema, type RegisterInput } from '@/utils/validation';
import { useRegister } from '@/features/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: registerUser, isPending, error, reset } = useRegister();
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student' as any,
        }
    });

    const selectedRole = watch('role');

    const onSubmit = (data: RegisterInput) => {
        setAuthError(null);
        reset();

        registerUser(data, {
            onSuccess: () => {
                navigate('/dashboard', { replace: true });
            },
            onError: (err: any) => {
                setAuthError(err.message || 'An unexpected error occurred during account creation.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-900">
            {/* Branding / Header */}
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                <Link to="/" className="inline-flex items-center gap-2 group">
                    <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-blue-50 group-hover:bg-blue-700 group-hover:scale-105 transition-all duration-300">
                        <HiTranslate className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                        Edu<span className="text-blue-600 italic">Stream</span>
                    </span>
                </Link>
            </div>

            {/* Auth Card */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 ring-1 ring-slate-200/60 max-w-lg w-full animate-in zoom-in-95 duration-500 delay-150 fill-mode-both border border-slate-100/50">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Create your account</h1>
                <p className="text-slate-500 mb-8 font-medium">Join our global network of students and teachers.</p>

                {/* Global Errors */}
                {(authError || error) && (
                    <Alert
                        type="error"
                        message={authError || (error as any)?.message}
                        onClose={() => setAuthError(null)}
                    />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            icon={<HiUser className="h-5 w-5" />}
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Email Address"
                            placeholder="name@work.com"
                            type="email"
                            icon={<HiMail className="h-5 w-5" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            icon={<HiLockClosed className="h-5 w-5" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="••••••••"
                            type="password"
                            icon={<HiLockClosed className="h-5 w-5" />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />
                    </div>

                    {/* Role Selection (High Fidelity Choice) */}
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700 ml-1 mb-3">Join as a:</p>
                        <div className="flex gap-4">
                            {[
                                { id: 'student', title: 'Student', icon: <HiAcademicCap className="h-5 w-5" />, desc: 'For learners' },
                                { id: 'teacher', title: 'Teacher', icon: <HiUser className="h-5 w-5" />, desc: 'For educators' }
                            ].map((role) => (
                                <label
                                    key={role.id}
                                    className={`
                                        relative flex flex-col flex-1 p-4 cursor-pointer rounded-[1.25rem] border-2 transition-all duration-200
                                        ${selectedRole === role.id
                                            ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50/50'
                                            : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200'}
                                    `}
                                >
                                    <input
                                        type="radio"
                                        {...register('role')}
                                        value={role.id}
                                        className="sr-only"
                                    />
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`
                                            p-2 rounded-xl border transition-colors
                                            ${selectedRole === role.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-white text-slate-500 border-slate-100'}
                                        `}>
                                            {role.icon}
                                        </div>
                                        <span className={`font-bold ${selectedRole === role.id ? 'text-blue-900' : 'text-slate-700'}`}>
                                            {role.title}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] uppercase tracking-widest font-black ${selectedRole === role.id ? 'text-blue-600/60' : 'text-slate-400'}`}>
                                        {role.desc}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.role && (
                            <p className="text-xs font-medium text-rose-500 ml-1">{errors.role.message}</p>
                        )}
                    </div>

                    <Button
                        variant="primary"
                        className="w-full h-12 shadow-lg shadow-blue-500/10 text-base"
                        isLoading={isPending}
                        rightIcon={<HiArrowRight className="h-5 w-5" />}
                        type="submit"
                    >
                        Create Account Now
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm font-medium text-slate-600">
                        Already registered?{' '}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:text-blue-700 font-bold decoration-blue-600/30 hover:underline transition-colors ml-1"
                        >
                            Sign in to existing account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-slate-400 text-xs font-medium uppercase tracking-widest leading-loose max-w-xs animate-in fade-in duration-1000">
                Education made simple, secure, and accessible for everyone.
            </div>
        </div>
    );
};

export default RegisterPage;
