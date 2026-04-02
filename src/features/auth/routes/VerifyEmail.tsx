import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowRight, HiOutlineShieldCheck } from 'react-icons/hi2';
import { useConfirmEmailVerification } from '@/features/auth';

const VerifyEmailPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { mutate: confirm, error } = useConfirmEmailVerification();

    const userId = searchParams.get('userId');
    const secret = searchParams.get('secret');

    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        if (userId && secret) {
            confirm({ userId, secret }, {
                onSuccess: () => setStatus('success'),
                onError: () => setStatus('error')
            });
        } else {
            // Use an async microtask to avoid cascading render lint
            Promise.resolve().then(() => setStatus('error'));
        }
    }, [userId, secret, confirm]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-6 py-12 selection:bg-primary/20">
            <div className="w-full max-w-md text-center relative">

                {/* Background Glow */}
                <div className="absolute inset-0 -z-10 blur-[100px] opacity-10 bg-linear-to-br from-primary to-secondary max-w-sm mx-auto" />

                <AnimatePresence mode="wait">
                    {status === 'verifying' && (
                        <motion.div
                            key="verifying"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="space-y-8"
                        >
                            <div className="relative inline-block">
                                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
                                    <HiOutlineShieldCheck className="w-10 h-10 text-primary animate-pulse" />
                                </div>
                                <motion.div
                                    className="absolute -inset-2 border-2 border-primary/20 rounded-4xl"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-heading font-black tracking-tight">Verifying Ledger...</h1>
                                <p className="text-base-content/60 font-medium">Updating your scholarly credentials in the digital atheneum.</p>
                            </div>
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="w-24 h-24 rounded-full bg-success/10 mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                >
                                    <HiOutlineCheckCircle className="w-14 h-14 text-success" />
                                </motion.div>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-4xl font-heading font-black tracking-tight text-base-content">Access Granted.</h1>
                                <p className="text-base-content/60 font-medium max-w-sm mx-auto">Your identity has been verified. Welcome to the elite tier of curated knowledge.</p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="pt-6"
                            >
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-primary h-16 px-10 rounded-4xl font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all group border-none"
                                >
                                    Enter Dashboard
                                    <HiOutlineArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-error/10 mx-auto flex items-center justify-center">
                                <HiOutlineXCircle className="w-10 h-10 text-error" />
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-3xl font-heading font-black tracking-tight">Cipher Mismatch.</h1>
                                <p className="text-base-content/60 font-medium max-w-xs mx-auto">
                                    {error?.message || "The verification token has expired or is invalid. Request a new sequence."}
                                </p>
                            </div>
                            <div className="pt-6 flex flex-col gap-4 max-w-xs mx-auto">
                                <Link to="/login" className="btn btn-outline h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] border-base-content/10 hover:bg-base-200 hover:border-transparent transition-all">
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default VerifyEmailPage;
