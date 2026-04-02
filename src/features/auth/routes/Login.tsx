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
import { loginSchema, type LoginInput } from '@/utils/validation';
import { useLogin } from '@/features/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

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
        <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground selection:bg-primary/10 transition-colors duration-500">

            {/* ── LEFT: Brand Panel ──────────────────────────────────────── */}
            <aside
                className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden px-16 py-14"
                style={{ background: 'linear-gradient(145deg, var(--color-surface-50) 0%, var(--color-surface-100) 50%, var(--color-surface-50) 100%)' }}
                aria-hidden="true"
            >
                <div className="absolute -top-20 -right-20 w-[440px] h-[440px] rounded-full opacity-40 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, var(--color-primary-100) 0%, transparent 70%)' }} />
                <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full opacity-30 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, var(--color-surface-200) 0%, transparent 70%)' }} />

                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold bg-primary shadow-lg shadow-primary/20">
                        E
                    </div>
                    <span className="font-bold text-lg tracking-tight text-foreground">EduStream</span>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="text-primary text-[10px] tracking-[0.2em] uppercase font-black">
                        The Digital Atheneum
                    </div>
                    <h1 className="text-6xl font-black leading-[1.05] tracking-tighter text-foreground">
                        Knowledge,<br />
                        <span className="text-primary italic">curated</span><br />
                        for you.
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-sm font-medium">
                        Access a world-class library of courses taught by leading experts.
                        Learn at your own pace, on your own terms.
                    </p>
                </div>

                <div className="relative z-10 rounded-2xl p-6 max-w-xs glass shadow-card bg-white/40 ring-1 ring-white/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-surface-200 shadow-sm" />
                            ))}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-foreground">42,000+ learners</p>
                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">enrolled now</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-warning)">
                                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                        <span className="text-xs font-bold text-foreground ml-1">4.9 / 5</span>
                    </div>
                </div>
            </aside>

            {/* ── RIGHT: Form Panel ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 bg-background">

                <div className="lg:hidden mb-12 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary-foreground text-sm font-bold bg-primary shadow-lg shadow-primary/20">
                        E
                    </div>
                    <span className="font-bold text-xl tracking-tight">EduStream</span>
                </div>

                <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black mb-3 tracking-tighter text-foreground">Welcome back</h2>
                        <p className="text-lg text-muted-foreground font-medium">Sign in to continue your learning journey.</p>
                    </div>

                    {authError && (
                        <div className="mb-8">
                            <Alert variant="destructive" className="rounded-3xl border-none bg-destructive/10 text-destructive shadow-sm">
                                <AlertDescription className="font-bold text-sm">{authError}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                        {/* Email */}
                        <div className="space-y-2.5">
                            <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">
                                Workspace Email
                            </Label>
                            <div className="relative group">
                                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    className={`h-14 rounded-3xl pl-12 bg-surface-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-primary/5 transition-all text-base font-medium ${errors.email ? 'border-destructive/20 ring-destructive/5' : ''}`}
                                    {...register('email')}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-center ml-1">
                                <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground">
                                    Cipher Key
                                </Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-[10px] uppercase font-black tracking-widest text-primary hover:text-primary-700 transition-colors"
                                >
                                    Forgot Key?
                                </Link>
                            </div>
                            <div className="relative group">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className={`h-14 rounded-3xl pl-12 pr-12 bg-surface-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-primary/5 transition-all text-base font-medium ${errors.password ? 'border-destructive/20 ring-destructive/5' : ''}`}
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-14 rounded-3xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                            >
                                {isPending ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In to Access
                                        <HiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>

                    <p className="mt-12 text-center text-sm font-bold text-muted-foreground">
                        New to the Atheneum?{' '}
                        <Link
                            to="/register"
                            className="text-primary hover:text-primary-700 transition-colors underline underline-offset-4 decoration-primary/20 hover:decoration-primary"
                        >
                            Create an account free
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
