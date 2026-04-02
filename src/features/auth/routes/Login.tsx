import { useState } from 'react';
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
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

// ── Google icon (no react-icons equivalent that matches this branding style) ─

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

// ── Page ─────────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: login, isPending, reset } = useLogin();

    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect logic
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
        <div className="min-h-screen flex flex-col lg:flex-row">

            {/* ── LEFT: Brand Panel (Digital Atheneum) ───────────────────── */}
            <aside
                className="hidden lg:flex flex-col justify-between w-[55%] relative overflow-hidden px-16 py-14"
                style={{ background: 'linear-gradient(145deg, #f1f4f8 0%, #e8ecf1 50%, #f1f4f8 100%)' }}
                aria-hidden="true"
            >
                {/* Ambient blobs for depth */}
                <div className="absolute -top-20 -right-20 w-[440px] h-[440px] rounded-full opacity-40 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #e0e7ff 0%, transparent 70%)' }} />
                <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full opacity-30 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #f3f4f6 0%, transparent 70%)' }} />

                {/* Wordmark */}
                <div className="relative z-10 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-[#4e45e4]">
                        E
                    </div>
                    <span className="font-semibold text-lg tracking-tight text-[#2d3338]">EduStream</span>
                </div>

                {/* Hero copy */}
                <div className="relative z-10 space-y-5">
                    <div className="text-[#4e45e4] text-[10px] tracking-[0.2em] uppercase font-bold">
                        The Digital Atheneum
                    </div>
                    <h1
                        className="text-5xl font-bold leading-[1.1] text-[#1e1e1e]"
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Knowledge,<br />
                        <span className="text-[#4e45e4]">curated</span><br />
                        for you.
                    </h1>
                    <p className="text-[#5a6065] text-base leading-relaxed max-w-sm">
                        Access a world-class library of courses taught by leading experts.
                        Learn at your own pace, on your own terms.
                    </p>
                </div>

                {/* Social proof card — Glassmorphism */}
                <div
                    className="relative z-10 rounded-2xl p-5 max-w-xs"
                    style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
                            ))}
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-[#1e1e1e]">42,000+ learners</p>
                            <p className="text-[11px] text-[#5a6065]">enrolled this month</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        ))}
                        <span className="text-[11px] text-[#5a6065] ml-1">4.9 / 5 rating</span>
                    </div>
                </div>
            </aside>

            {/* ── RIGHT: Form Panel ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 bg-white">

                {/* Mobile logo */}
                <div className="lg:hidden mb-10 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-[#4e45e4]">
                        E
                    </div>
                    <span className="font-semibold text-lg tracking-tight">EduStream</span>
                </div>

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="mb-8">
                        <h2
                            className="text-3xl font-bold mb-1.5 text-[#1e1e1e]"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Welcome back
                        </h2>
                        <p className="text-sm text-[#5a6065]">
                            Sign in to continue your learning journey.
                        </p>
                    </div>

                    {/* Auth error */}
                    {authError && (
                        <div className="mb-6">
                            <Alert
                                type="error"
                                message={authError}
                                onClose={() => setAuthError(null)}
                            />
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-20">

                        {/* Email */}
                        <Input
                            id="login-email"
                            label="Email Address"
                            placeholder="you@example.com"
                            icon={<HiOutlineEnvelope size={19} />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        {/* Password */}
                        <Input
                            id="login-password"
                            label="Password"
                            labelRight={
                                <Link
                                    to="/forgot-password"
                                    tabIndex={-1}
                                    className="text-[#4e45e4] hover:text-[#3d36b8] transition-colors font-medium"
                                >
                                    Forgot password?
                                </Link>
                            }
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            icon={<HiOutlineLockClosed size={19} />}
                            trailing={
                                <button
                                    type="button"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="text-[#adb3b8] hover:text-[#4e45e4] transition-colors"
                                    onClick={() => setShowPassword(v => !v)}
                                >
                                    {showPassword ? <HiOutlineEyeSlash size={19} /> : <HiOutlineEye size={19} />}
                                </button>
                            }
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        {/* Submit */}
                        <div className="pt-2">
                            <Button
                                id="login-submit"
                                variant="primary"
                                className="w-full"
                                isLoading={isPending}
                                rightIcon={<HiArrowRight size={17} />}
                                type="submit"
                            >
                                Sign In
                            </Button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-[#f1f4f8]" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-white px-3 text-[#adb3b8]">or</span>
                        </div>
                    </div>

                    {/* SSO / Social */}
                    <Button
                        variant="secondary"
                        className="w-full"
                        leftIcon={<GoogleIcon />}
                    >
                        Continue with Google
                    </Button>

                    {/* Sign up link */}
                    <p className="mt-8 text-center text-sm text-[#5a6065]">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[#4e45e4] hover:text-[#3d36b8] transition-colors"
                        >
                            Create one free →
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
