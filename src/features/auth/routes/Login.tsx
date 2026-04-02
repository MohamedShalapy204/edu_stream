import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiArrowRight,
} from 'react-icons/hi2';
import { useLogin, loginSchema, type LoginInput } from '@/features/auth';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: login, isPending, reset } = useLogin();

    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const onSubmit = (data: LoginInput) => {
        setAuthError(null);
        reset();
        login(data, {
            onSuccess: () => navigate(from, { replace: true }),
            onError: (err: Error) =>
                setAuthError(err.message || 'An unexpected error occurred. Please try again.'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-base-100 text-base-content selection:bg-primary/20 transition-colors duration-500 overflow-hidden">

            {/* ── LEFT: Brand Panel ──────────────────────────────────────── */}
            <aside
                className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden px-18 py-16"
                style={{ background: 'linear-gradient(135deg, var(--color-base-100) 0%, var(--color-base-200) 100%)' }}
                aria-hidden="true"
            >
                {/* Decorative Ambient Glows */}
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none blur-3xl"
                    style={{ background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none blur-3xl"
                    style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }} />

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary-content text-lg font-black bg-primary shadow-premium">
                        EDU
                    </div>
                    <span className="font-heading text-xl font-bold tracking-tight">stream</span>
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="text-primary text-[10px] tracking-[0.25em] uppercase font-black opacity-80 decoration-primary/30 underline underline-offset-8">
                        The Digital Curator
                    </div>
                    <h1 className="text-7xl font-heading font-black leading-none tracking-tight text-base-content">
                        Knowledge,<br />
                        <span className="text-primary italic font-medium">curated</span><br />
                        for you.
                    </h1>
                    <p className="text-base-content/60 text-xl leading-relaxed max-w-sm font-medium">
                        Access world-class courses designed for the modern scholar. A library of intelligence at your fingertips.
                    </p>
                </div>

                {/* 42k Learners Glass Card */}
                <div className="relative z-10 max-w-xs glass rounded-3xl p-8 border-none ring-1 ring-white/20">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-base-200 shadow-sm" />
                            ))}
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-primary-content font-black">+</div>
                        </div>
                        <div>
                            <p className="text-sm font-black tracking-tight">42,000+ learners</p>
                            <p className="text-[10px] uppercase font-black tracking-[0.15em] text-base-content/40">knowledge seekers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1 opacity-80">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} width="16" height="16" viewBox="0 0 24 24" className="fill-warning">
                                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                        <span className="text-xs font-black ml-2 tabular-nums">4.9 / 5.0</span>
                    </div>
                </div>
            </aside>

            {/* ── RIGHT: Form Panel ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center justify-center px-8 lg:px-22 bg-base-100 relative">

                {/* Mobile Header */}
                <div className="lg:hidden absolute top-12 flex items-center gap-2">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary-content text-lg font-bold bg-primary shadow-premium">
                        EDU
                    </div>
                    <span className="font-heading text-xl font-bold tracking-tight">stream</span>
                </div>

                <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <div className="text-center lg:text-left space-y-3">
                        <h2 className="text-5xl font-heading font-black tracking-tight text-base-content leading-tight">Welcome back</h2>
                        <p className="text-lg text-base-content/50 font-medium">Continue your journey into curated knowledge.</p>
                    </div>

                    {authError && (
                        <div className="alert alert-error rounded-3xl border-none bg-error/10 text-error flex items-center gap-4 p-4 shadow-sm">
                            <span className="font-black text-xs uppercase tracking-widest">{authError}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                        <div className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-[10px] uppercase font-black tracking-[0.25em] text-base-content/40 ml-1">
                                    Email
                                </label>
                                <div className="relative group/field">
                                    <HiOutlineEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30 group-focus-within/field:text-primary transition-colors" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@atheneum.com"
                                        className={`input input-ghost h-16 w-full rounded-2xl pl-14 bg-base-200 border-none focus:bg-white focus:shadow-premium transition-all text-base font-semibold placeholder:text-base-content/20 ${errors.email ? 'ring-2 ring-error/30' : ''}`}
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-[10px] font-black uppercase text-error tracking-widest ml-1">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label htmlFor="password" className="text-[10px] uppercase font-black tracking-[0.25em] text-base-content/40">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-[10px] uppercase font-black tracking-widest text-primary hover:opacity-70 transition-opacity"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group/field">
                                    <HiOutlineLockClosed className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30 group-focus-within/field:text-primary transition-colors" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className={`input input-ghost h-16 w-full rounded-2xl pl-14 pr-14 bg-base-200 border-none focus:bg-white focus:shadow-premium transition-all text-base font-semibold placeholder:text-base-content/20 ${errors.password ? 'ring-2 ring-error/30' : ''}`}
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-primary transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-[10px] font-black uppercase text-error tracking-widest ml-1">{errors.password.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="btn btn-primary w-full h-16 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:scale-[1.01] active:scale-[0.99] transition-all group no-animation border-none"
                            >
                                {isPending ? (
                                    <span className="loading loading-spinner" />
                                ) : (
                                    <>
                                        Sign In to Access
                                        <HiArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-sm font-bold text-base-content/30">
                            New to the Stream?{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:underline underline-offset-8 transition-all font-black decoration-2"
                            >
                                Create an account free
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
