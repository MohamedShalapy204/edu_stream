import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineUser,
    HiOutlineArrowRight,
    HiOutlineChevronRight,
    HiCheckCircle,
} from 'react-icons/hi2';
import { useRegister, UserRole, registerSchema, type RegisterInput, useSendEmailVerification } from '@/features/auth';

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { mutate: registerUser, isPending: isRegistering, reset: resetRegister } = useRegister();
    const { mutate: sendVerification } = useSendEmailVerification();

    const [authError, setAuthError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: UserRole.STUDENT },
    });

    const onSubmit = (data: RegisterInput) => {
        setAuthError(null);
        resetRegister();
        registerUser(data, {
            onSuccess: () => {
                sendVerification(undefined, {
                    onSuccess: () => navigate('/login', {
                        state: { message: t('auth.register.verificationSent') }
                    }),
                    onError: () => navigate('/login', {
                        state: { message: t('auth.register.verificationError') }
                    })
                });
            },
            onError: (err: Error) => setAuthError(err.message || t('auth.register.registrationFailed')),
        });
    };

    const containerVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
                duration: 0.8,
                ease: "circOut"
            }
        }
    } as Variants;

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    } as Variants;

    return (
        <div className="min-h-screen flex bg-base-100 text-base-content selection:bg-primary/20 overflow-x-hidden">


            {/* ── LEFT: Form Section ──────────────────────────────────────── */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 py-16 lg:px-24 overflow-y-auto">

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg space-y-12"
                >

                    {/* Header */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-content text-sm font-black shadow-premium group-hover:scale-105 transition-transform">E</div>
                            <span className="font-heading text-lg font-black tracking-tight">EduStream</span>
                        </Link>
                        <h2 className="text-4xl font-heading font-black tracking-tighter">{t('auth.register.joinMasterclass')}</h2>
                        <p className="text-lg text-base-content/60 font-medium max-w-sm">{t('auth.register.heroSubtitle')}</p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {authError && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                className="alert alert-error rounded-3xl border-none shadow-premium bg-error/10 text-error flex items-center gap-3 overflow-hidden"
                            >
                                <span className="font-bold text-sm tracking-tight text-error">{authError}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Name */}
                            <div className="space-y-3">
                                <label htmlFor="name" className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40 ml-1">{t('auth.register.nameLabel')}</label>
                                <div className="relative group">
                                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                                    <input id="name" placeholder={t('auth.register.namePlaceholder')} className="input input-ghost w-full h-14 rounded-3xl pl-12 bg-base-200 border-none focus:bg-base-100 focus:shadow-premium transition-all text-base font-medium" {...register('name')} />
                                </div>
                                {errors.name && <p className="text-[10px] font-black uppercase text-error tracking-widest ml-1">{errors.name.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40 ml-1">{t('auth.register.emailLabel')}</label>
                                <div className="relative group">
                                    <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                                    <input id="email" type="email" placeholder={t('auth.register.emailPlaceholder')} className="input input-ghost w-full h-14 rounded-3xl pl-12 bg-base-200 border-none focus:bg-base-100 focus:shadow-premium transition-all text-base font-medium" {...register('email')} />
                                </div>
                                {errors.email && <p className="text-[10px] font-black uppercase text-error tracking-widest ml-1">{errors.email.message}</p>}
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Password */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40 ml-1">{t('auth.register.passwordLabel')}</label>
                                <div className="relative group">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                                    <input id="password" type="password" placeholder="••••••••" className="input input-ghost w-full h-14 rounded-3xl pl-12 bg-base-200 border-none focus:bg-base-100 focus:shadow-premium transition-all text-base font-medium" {...register('password')} />
                                </div>
                                {errors.password && <p className="text-[10px] font-black uppercase text-error tracking-widest ml-1">{errors.password.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-3">
                                <label htmlFor="confirmPassword" className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40 ml-1">{t('auth.register.confirmPasswordLabel')}</label>
                                <div className="relative group">
                                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/30 group-focus-within:text-primary transition-colors" />
                                    <input id="confirmPassword" type="password" placeholder="••••••••" className="input input-ghost w-full h-14 rounded-3xl pl-12 bg-base-200 border-none focus:bg-base-100 focus:shadow-premium transition-all text-base font-medium" {...register('confirmPassword')} />
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] font-black uppercase text-error tracking-widest ml-1">{errors.confirmPassword.message}</p>}
                            </div>
                        </motion.div>

                        {/* Role Selector */}
                        <motion.div variants={itemVariants} className="space-y-4">
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/40 ml-1">{t('auth.register.chooseAccountType')}</label>
                            <Controller
                                control={control}
                                name="role"
                                render={({ field: { value, onChange } }) => (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { id: UserRole.STUDENT, title: t('auth.register.roleStudentTitle'), desc: t('auth.register.roleStudentDesc') },
                                            { id: UserRole.TEACHER, title: t('auth.register.roleTeacherTitle'), desc: t('auth.register.roleTeacherDesc') }
                                        ].map((role) => (
                                            <motion.button
                                                key={role.id}
                                                type="button"
                                                onClick={() => onChange(role.id)}
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`flex items-center gap-5 p-6 rounded-4xl text-left transition-all duration-300 group relative overflow-hidden ${value === role.id ? 'bg-primary text-primary-content shadow-premium' : 'bg-base-200 text-base-content hover:bg-base-300'}`}
                                            >
                                                <div className={`w-3 h-3 rounded-full border-2 transition-all ${value === role.id ? 'border-primary-content bg-primary-content shadow-[0_0_12px_rgba(255,255,255,0.3)]' : 'border-primary/20 group-hover:border-primary'}`} />
                                                <div>
                                                    <p className={`text-base font-black uppercase tracking-widest mb-0.5 ${value === role.id ? 'text-primary-content' : 'text-base-content'}`}>{role.title}</p>
                                                    <p className={`text-xs font-medium ${value === role.id ? 'text-primary-content/70' : 'text-base-content/60'}`}>{role.desc}</p>
                                                </div>
                                                <div className={`absolute top-0 right-0 p-4 transition-all ${value === role.id ? 'opacity-20 translate-x-0' : 'opacity-0 translate-x-2'}`}>
                                                    <HiOutlineChevronRight className="w-12 h-12" />
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            />
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-8">
                            <button
                                type="submit"
                                disabled={isRegistering}
                                className="btn btn-primary w-full h-16 rounded-4xl font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group no-animation border-none"
                            >
                                {isRegistering ? <span className="loading loading-spinner" /> : <>{t('auth.register.finalizeEnrollment')} <HiOutlineArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" /></>}
                            </button>
                        </motion.div>
                    </form>

                    <motion.div variants={itemVariants} className="pt-4 text-center">
                        <p className="text-sm font-bold text-base-content/40">
                            {t('auth.register.alreadyHaveAccess')}{' '}
                            <Link to="/login" className="text-primary hover:underline underline-offset-8 transition-all font-black decoration-2">{t('auth.register.signInDirectly')}</Link>
                        </p>
                    </motion.div>
                </motion.div>
            </main>

            {/* ── RIGHT: Brand Visual ───────────────────────────────────── */}
            <aside className="hidden xl:flex flex-col justify-end w-[42%] relative overflow-hidden px-20 py-24 bg-base-200/50" aria-hidden="true">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="absolute top-0 right-0 w-full h-[60%] bg-linear-to-br from-primary/5 to-transparent pointer-events-none"
                />

                <div className="relative z-10 space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 64 }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "circOut" }}
                            className="w-1.5 bg-primary rounded-full mb-8 shadow-premium"
                        />
                        <h3 className="text-5xl font-heading font-black leading-[1.05] tracking-tight text-base-content">
                            {t('auth.register.elevateLiteracy')}<br />
                            <span className="text-primary tracking-tighter">{t('auth.register.digitalLiteracy')}</span>
                        </h3>
                    </div>

                    <div className="space-y-8 max-w-sm">
                        {[
                            { title: t('auth.register.feature1Title'), text: t('auth.register.feature1Desc') },
                            { title: t('auth.register.feature2Title'), text: t('auth.register.feature2Desc') },
                            { title: t('auth.register.feature3Title'), text: t('auth.register.feature3Desc') }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 + (i * 0.2) }}
                                className="flex gap-5 group"
                            >
                                <HiCheckCircle className="w-7 h-7 text-primary/40 group-hover:text-primary transition-colors shrink-0" />
                                <div className="space-y-1">
                                    <p className="font-black text-xs uppercase tracking-[0.2em] text-base-content">{item.title}</p>
                                    <p className="font-medium text-sm text-base-content/60 leading-relaxed">{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="pt-10"
                    >
                        <div className="inline-flex items-center gap-6 p-1.5 bg-base-100 rounded-3xl shadow-premium ring-1 ring-base-content/10">
                            <div className="flex -space-x-3 px-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 2 + (i * 0.1) }}
                                        className="w-10 h-10 rounded-full bg-base-200 border-2 border-base-content/5 shadow-sm"
                                    />
                                ))}
                            </div>
                            <div className="pr-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-base-content">{t('auth.register.nextCohort')}</p>
                                <p className="text-xs font-bold text-primary">{t('auth.register.nextCohortDate')}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </aside>
        </div>
    );
};

export default RegisterPage;
