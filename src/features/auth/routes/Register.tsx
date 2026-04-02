import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiCheckCircle,
    HiOutlineArrowRight,
    HiOutlineChevronRight,
} from 'react-icons/hi2';
import { registerSchema, type RegisterInput } from '@/utils/validation';
import { useRegister, UserRole } from '@/features/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { mutate: registerUser, isPending, reset } = useRegister();
    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', role: UserRole.STUDENT },
    });

    const onSubmit = (data: RegisterInput) => {
        setAuthError(null);
        reset();
        registerUser(data, {
            onSuccess: () => navigate('/login'),
            onError: (err: Error) => setAuthError(err.message || 'Registration failed. Please try again.'),
        });
    };

    return (
        <div className="min-h-screen flex bg-background text-foreground selection:bg-primary/20">

            {/* ── LEFT: Form Section ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 py-16 lg:px-24 overflow-y-auto">

                <div className="w-full max-w-lg space-y-12 animate-in fade-in slide-in-from-left-4 duration-1000">

                    {/* Header */}
                    <div className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">E</div>
                            <span className="font-black text-lg tracking-tight">EduStream</span>
                        </Link>
                        <h2 className="text-4xl font-black tracking-tighter">Join the masterclass.</h2>
                        <p className="text-lg text-muted-foreground font-medium max-w-sm">Begin your journey in our editorial digital learning space.</p>
                    </div>

                    {authError && (
                        <Alert variant="destructive" className="rounded-3xl border-none shadow-sm bg-destructive/10 text-destructive">
                            <AlertDescription className="font-bold text-sm tracking-tight">{authError}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Full Identity</Label>
                                <div className="relative group">
                                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input id="name" placeholder="John Doe" className="h-14 rounded-3xl pl-12 bg-surface-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-primary/5 transition-all text-base font-medium" {...register('name')} />
                                </div>
                                {errors.name && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">E-Mail Address</Label>
                                <div className="relative group">
                                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input id="email" type="email" placeholder="you@domain.com" className="h-14 rounded-3xl pl-12 bg-surface-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-primary/5 transition-all text-base font-medium" {...register('email')} />
                                </div>
                                {errors.email && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Role Selector Dashboard Style */}
                        <div className="space-y-4">
                            <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Define Your Path</Label>
                            <Controller
                                control={control}
                                name="role"
                                render={({ field: { value, onChange } }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: UserRole.STUDENT, title: 'Learn', desc: 'Expand knowledge library' },
                                            { id: UserRole.TEACHER, title: 'Teach', desc: 'Curate your syllabus' }
                                        ].map((role) => (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => onChange(role.id)}
                                                className={`flex items-center gap-5 p-6 rounded-[2rem] text-left transition-all duration-300 group relative overflow-hidden ${value === role.id ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.02]' : 'bg-surface-50 text-foreground hover:bg-surface-100 hover:scale-[1.01]'}`}
                                            >
                                                <div className={`w-3 h-3 rounded-full border-2 transition-all ${value === role.id ? 'border-primary-foreground bg-primary-foreground shadow-[0_0_12px_var(--color-primary-100)]' : 'border-primary/20 group-hover:border-primary'}`} />
                                                <div>
                                                    <p className={`text-base font-black uppercase tracking-widest mb-0.5 ${value === role.id ? 'text-primary-foreground' : 'text-foreground'}`}>{role.title}</p>
                                                    <p className={`text-xs font-medium ${value === role.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{role.desc}</p>
                                                </div>
                                                <div className={`absolute top-0 right-0 p-4 transition-all ${value === role.id ? 'opacity-20 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                                                    <HiOutlineChevronRight className="w-12 h-12" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-3">
                            <Label htmlFor="password" className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground ml-1">Secret Key</Label>
                            <div className="relative group">
                                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="password" type="password" placeholder="••••••••" className="h-14 rounded-3xl pl-12 bg-surface-50 border-transparent focus:bg-white focus:border-primary/20 focus:ring-primary/5 transition-all text-base font-medium" {...register('password')} />
                            </div>
                            {errors.password && <p className="text-[10px] font-black uppercase text-destructive tracking-widest ml-1">{errors.password.message}</p>}
                        </div>

                        <div className="pt-8">
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-16 rounded-[2rem] bg-primary text-primary-foreground font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
                            >
                                {isPending ? <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Finalize Enrollment <HiOutlineArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></>}
                            </Button>
                        </div>
                    </form>

                    <p className="mt-14 text-center text-sm font-bold text-muted-foreground">
                        Already have access?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-700 transition-colors underline underline-offset-8 decoration-primary/20 hover:decoration-primary">Sign in directly</Link>
                    </p>
                </div>
            </main>

            {/* ── RIGHT: Brand Visual ───────────────────────────────────── */}
            <aside className="hidden xl:flex flex-col justify-end w-[42%] relative overflow-hidden px-20 py-24 bg-surface-100/50" aria-hidden="true">
                {/* Visual Depth Elements */}
                <div className="absolute top-0 right-0 w-full h-[60%] bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-surface-200/50 blur-[100px] pointer-events-none" />

                <div className="relative z-10 space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                    <div className="space-y-4">
                        <div className="w-1.5 h-16 bg-primary rounded-full mb-8 shadow-glow" />
                        <h3 className="text-5xl font-black leading-[1.05] tracking-tight text-foreground">
                            Elevate your<br />
                            <span className="text-primary tracking-tighter">digital literacy.</span>
                        </h3>
                    </div>

                    <div className="space-y-8 max-w-sm">
                        {[
                            { title: 'Global Faculty', text: 'Curriculum audited by industry pioneers.' },
                            { title: 'Peer Collective', text: 'Dynamic networking with 40k+ alumni.' },
                            { title: 'Scholarly Archive', text: 'Eternal access to updated courseware.' }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-5 group">
                                <HiCheckCircle className="w-7 h-7 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
                                <div className="space-y-1">
                                    <p className="font-black text-xs uppercase tracking-[0.2em] text-foreground">{item.title}</p>
                                    <p className="font-medium text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-10">
                        <div className="inline-flex items-center gap-6 p-1.5 bg-white rounded-3xl shadow-card ring-1 ring-background/10">
                            <div className="flex -space-x-3 px-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-surface-100 border-2 border-white shadow-sm" />
                                ))}
                            </div>
                            <div className="pr-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">Next Cohort</p>
                                <p className="text-xs font-bold text-primary">April 15, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default RegisterPage;
