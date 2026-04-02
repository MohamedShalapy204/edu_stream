import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiArrowRight,
    HiXCircle,
    HiOutlineAcademicCap,
    HiOutlinePencilSquare,
    HiCheckCircle,
} from 'react-icons/hi2';
import { registerSchema, type RegisterInput } from '@/utils/validation';
import { useRegister } from '@/features/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

// ── Role options ─────────────────────────────────────────────────────────────

const ROLES = [
    {
        id: 'student' as const,
        label: 'Student',
        desc: 'I want to learn',
        icon: <HiOutlineAcademicCap size={20} />,
    },
    {
        id: 'teacher' as const,
        label: 'Educator',
        desc: 'I want to teach',
        icon: <HiOutlinePencilSquare size={20} />,
    },
] as const;

// ── Page ─────────────────────────────────────────────────────────────────────

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: registerUser, isPending, reset } = useRegister();

    const [authError, setAuthError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
            role: 'student',
        },
    });

    const selectedRole = watch('role');

    const onSubmit = (data: RegisterInput) => {
        setAuthError(null);
        reset();
        registerUser(data, {
            onSuccess: () => navigate('/dashboard', { replace: true }),
            onError: (err: Error) =>
                setAuthError(err.message || 'An unexpected error occurred during account creation.'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-[#f1f4f8]">

            {/* ── LEFT: Brand Panel ──────────────────────────────────────── */}
            <aside
                className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden px-14 py-14"
                style={{ background: 'linear-gradient(145deg, #f1f4f8 0%, #e8ecf1 50%, #f1f4f8 100%)' }}
                aria-hidden="true"
            >
                {/* Ambient blobs for depth */}
                <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full opacity-40 pointer-events-none"
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
                        Join The Academy
                    </div>
                    <h1
                        className="text-4xl font-bold leading-[1.15] text-[#1e1e1e]"
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        Start your<br />
                        learning<br />
                        <span className="text-[#4e45e4]">journey today.</span>
                    </h1>
                    <p className="text-[#5a6065] text-sm leading-relaxed max-w-xs">
                        Join over 42,000 students and educators building real skills on EduStream.
                    </p>
                </div>

                {/* Feature checklist card — Glassmorphism */}
                <div
                    className="relative z-10 rounded-2xl p-6 space-y-4 max-w-xs"
                    style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                    }}
                >
                    {[
                        'Access 500+ expert-led courses',
                        'Learn at your own pace',
                        'Earn verified certificates',
                        'Cancel anytime — no lock-in',
                    ].map((item) => (
                        <div key={item} className="flex items-center gap-3">
                            <HiCheckCircle size={18} className="text-[#4e45e4] shrink-0" />
                            <span className="text-sm text-[#5a6065] font-medium">{item}</span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* ── RIGHT: Form Panel ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-14 bg-white overflow-y-auto">

                {/* Mobile logo */}
                <div className="lg:hidden mb-8 flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold bg-[#4e45e4]">
                        E
                    </div>
                    <span className="font-semibold text-lg tracking-tight">EduStream</span>
                </div>

                <div className="w-full max-w-lg">

                    {/* Heading */}
                    <div className="mb-8 text-left">
                        <h2
                            className="text-3xl font-bold mb-1.5 text-[#1e1e1e]"
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            Create your account
                        </h2>
                        <p className="text-sm text-[#5a6065]">
                            It's free to join. No credit card required.
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

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">

                        {/* Name + Email row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="register-name"
                                label="Full Name"
                                placeholder="Jane Doe"
                                icon={<HiOutlineUser size={19} />}
                                error={errors.name?.message}
                                {...register('name')}
                            />
                            <Input
                                id="register-email"
                                label="Email Address"
                                placeholder="you@example.com"
                                type="email"
                                icon={<HiOutlineEnvelope size={19} />}
                                error={errors.email?.message}
                                {...register('email')}
                            />
                        </div>

                        {/* Password + Confirm row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                id="register-password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Min. 8 chars"
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
                            <Input
                                id="register-confirm-password"
                                label="Confirm Password"
                                type={showConfirm ? 'text' : 'password'}
                                placeholder="Repeat password"
                                icon={<HiOutlineLockClosed size={19} />}
                                trailing={
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                                        className="text-[#adb3b8] hover:text-[#4e45e4] transition-colors"
                                        onClick={() => setShowConfirm(v => !v)}
                                    >
                                        {showConfirm ? <HiOutlineEyeSlash size={19} /> : <HiOutlineEye size={19} />}
                                    </button>
                                }
                                error={errors.confirmPassword?.message}
                                {...register('confirmPassword')}
                            />
                        </div>

                        {/* Role Selector */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#adb3b8] ml-0.5">
                                I am joining as a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {ROLES.map((role) => {
                                    const isSelected = selectedRole === role.id;
                                    return (
                                        <label
                                            key={role.id}
                                            className={[
                                                'flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none border border-transparent',
                                                isSelected
                                                    ? 'bg-[#4e45e4]/5 shadow-[0_4px_12px_rgba(78,69,228,0.08)] ring-1 ring-[#4e45e4]'
                                                    : 'bg-[#f1f4f8] hover:bg-[#e8ecf1]',
                                            ].join(' ')}
                                        >
                                            <input
                                                type="radio"
                                                {...register('role')}
                                                value={role.id}
                                                className="sr-only"
                                            />
                                            {/* Icon circle */}
                                            <div className={[
                                                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                                                isSelected ? 'bg-[#4e45e4] text-white shadow-lg shadow-[#4e45e4]/20' : 'bg-white text-[#adb3b8]',
                                            ].join(' ')}>
                                                {role.icon}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold leading-none mb-1 ${isSelected ? 'text-[#4e45e4]' : 'text-[#1e1e1e]'}`}>
                                                    {role.label}
                                                </p>
                                                <p className="text-[11px] text-[#adb3b8] tracking-wide">
                                                    {role.desc}
                                                </p>
                                            </div>
                                            {/* Checkmark overlay */}
                                            {isSelected && (
                                                <HiCheckCircle size={18} className="text-[#4e45e4] ml-auto shrink-0" />
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.role && (
                                <p className="text-xs text-[#9b1c1c] ml-0.5">{errors.role.message}</p>
                            )}
                        </div>

                        {/* Submit button */}
                        <div className="pt-2">
                            <Button
                                id="register-submit"
                                variant="primary"
                                className="w-full"
                                isLoading={isPending}
                                rightIcon={<HiArrowRight size={17} />}
                                type="submit"
                            >
                                Create Account
                            </Button>
                        </div>
                    </form>

                    {/* Sign in link */}
                    <p className="mt-8 text-center text-sm text-[#5a6065]">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="font-semibold text-[#4e45e4] hover:text-[#3d36b8] transition-colors"
                        >
                            Sign in →
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
