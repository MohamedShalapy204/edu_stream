import React from 'react';
import { motion } from 'motion/react';
import { HiOutlineShieldExclamation, HiOutlineEnvelope, HiOutlineArrowLeftOnRectangle } from 'react-icons/hi2';
import { useLogout, useSendEmailVerification, useCurrentAccount } from '@/features/auth';

const UnverifiedPage: React.FC = () => {
    const { mutate: logout } = useLogout();
    const { mutate: sendVerification, isPending: isSending } = useSendEmailVerification();
    const { data: account } = useCurrentAccount();

    return (
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center p-6 selection:bg-primary/20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="w-full max-w-lg text-center space-y-10"
            >
                <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-[2.5rem] bg-warning/10 flex items-center justify-center mx-auto">
                        <HiOutlineShieldExclamation className="w-12 h-12 text-warning animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-5xl font-heading font-black tracking-tighter leading-tight">Access Suspended.</h1>
                    <p className="text-lg text-base-content/60 font-medium max-w-md mx-auto leading-relaxed">
                        Your account for <span className="text-primary font-bold">{account?.email}</span> requires a cryptographic signature.
                        Please verify your email to unlock the full Atheneum experience.
                    </p>
                </div>

                <div className="pt-8 flex flex-col gap-4 max-w-sm mx-auto">
                    <button
                        onClick={() => sendVerification()}
                        disabled={isSending}
                        className="btn btn-primary h-16 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                    >
                        {isSending ? (
                            <span className="loading loading-spinner" />
                        ) : (
                            <>
                                Resend Verification Link
                                <HiOutlineEnvelope className="ml-3 w-5 h-5" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={() => logout()}
                        className="btn btn-ghost h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] text-base-content/40 hover:text-error hover:bg-error/5 transition-all"
                    >
                        Sign Out & Try Another
                        <HiOutlineArrowLeftOnRectangle className="ml-3 w-4 h-4" />
                    </button>
                </div>

                <div className="pt-12 text-[10px] uppercase font-black tracking-[0.25em] text-base-content/20">
                    Security Protocol: EDU-ST-VER-42
                </div>
            </motion.div>
        </div>
    );
};

export default UnverifiedPage;
