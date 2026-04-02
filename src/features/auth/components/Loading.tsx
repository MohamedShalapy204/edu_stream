import React from 'react';
import { motion } from 'motion/react';

const AuthLoading: React.FC = () => {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-base-100 text-base-content overflow-hidden relative">

            {/* Soft Ambient Glows */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.15, scale: 1 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 -z-10 blur-[120px] bg-linear-to-br from-primary/30 to-secondary/30 pointer-events-none"
            />

            <div className="relative flex flex-col items-center gap-10">
                {/* Logo Orbit Animation */}
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 rounded-full border border-primary/10 border-t-primary/60 border-l-primary/30 shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.1)]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-content text-lg font-black shadow-premium">
                            E
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-4">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="font-heading text-2xl font-black tracking-tighter"
                    >
                        EDU<span className="text-primary italic font-medium">stream</span>
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        transition={{ delay: 0.4, duration: 1 }}
                        className="flex items-center gap-3 justify-center"
                    >
                        <span className="text-[10px] uppercase font-black tracking-[0.3em]">Curating Intelligence</span>
                        <div className="w-1 h-1 rounded-full bg-base-content/40" />
                        <span className="text-[10px] uppercase font-black tracking-[0.3em]">Atheneum v1.0</span>
                    </motion.div>
                </div>

                {/* Progress-ish Bar */}
                <div className="w-48 h-0.5 bg-base-content/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full bg-linear-to-r from-transparent via-primary to-transparent"
                    />
                </div>
            </div>

            {/* Subtle Noise Texture overlay could be here if we had an asset, but let's stick to CSS */}
        </div>
    );
};

export default AuthLoading;
