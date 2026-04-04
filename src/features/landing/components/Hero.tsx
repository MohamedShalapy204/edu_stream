import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi2';

export const Hero: React.FC = () => {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">

                {/* Text Content */}
                <div className="flex-1 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/10"
                    >
                        <HiOutlineSparkles className="w-3.5 h-3.5" />
                        The Digital Atheneum is Open
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
                            className="text-6xl lg:text-8xl font-heading font-black leading-[0.9] tracking-tighter text-base-content"
                        >
                            Knowledge,<br />
                            <span className="text-primary italic font-medium">curated</span> for the<br />
                            modern scholar.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.6, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="max-w-xl text-xl lg:text-2xl font-medium leading-relaxed text-base-content/80 mx-auto lg:mx-0"
                        >
                            Access a library of world-class intelligence. Built for institutions that demand excellence and students who seek mastery.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-6 pt-4"
                    >
                        <Link to="/register">
                            <button className="btn btn-primary h-16 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all border-none">
                                Begin Enrollment
                                <HiOutlineArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        <Link to="/courses" className="text-xs font-black uppercase tracking-[0.3em] text-base-content/40 hover:text-primary transition-colors py-4">
                            Explore Curriculum
                        </Link>
                    </motion.div>
                </div>

                {/* Decorative Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.4, duration: 1, ease: "circOut" }}
                    className="flex-1 relative hidden lg:block"
                >
                    <div className="relative z-10 w-full aspect-square max-w-lg mx-auto overflow-hidden rounded-[4rem] bg-base-200 shadow-premium p-1">
                        <div className="w-full h-full rounded-[3.9rem] bg-white flex items-center justify-center p-12 overflow-hidden relative group">
                            {/* Scholarly Abstract Visual */}
                            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5" />
                            <div className="w-full h-full border border-base-content/5 rounded-3xl flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                                <span className="text-[240px] font-heading font-black italic text-primary/10 select-none">E</span>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-white to-transparent" />
                            </div>
                        </div>
                    </div>
                    {/* Floating accents */}
                    <motion.div
                        animate={{ y: [0, -80, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-12 -right-12 w-48 h-48 glass rounded-[3rem] p-1 shadow-premium hidden lg:block"
                    >
                        <div className="w-full h-full rounded-[2.8rem] bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center gap-2">
                            <span className="text-3xl font-heading font-black text-primary">42k</span>
                            <span className="text-[8px] uppercase font-black tracking-[0.2em] text-base-content/40">Active Scholars</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
