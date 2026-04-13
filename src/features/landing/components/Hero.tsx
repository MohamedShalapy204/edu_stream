import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi2';

export const Hero: React.FC = () => {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            {/* Ambient background glows — more intentional indigo mesh */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden">
                {/* Primary top-left bloom */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/12 blur-[140px] -translate-y-1/2" />
                {/* Secondary bottom-right bloom */}
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/8 blur-[100px]" />
                {/* Subtle indigo stripe across mid */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/15 to-transparent -translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 md:gap-16">

                {/* Text Content */}
                <div className="flex-1 space-y-8 md:space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/20"
                    >
                        <HiOutlineSparkles className="w-3.5 h-3.5 text-accent" />
                        The Digital Atheneum is Open
                    </motion.div>

                    <div className="space-y-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: "circOut" }}
                            className="text-5xl md:text-6xl lg:text-8xl font-heading font-black leading-[0.95] md:leading-[0.9] tracking-tighter text-base-content"
                        >
                            Knowledge,<br />
                            <span className="text-primary italic font-medium">curated</span> for <span className="hidden md:inline">the</span><br />
                            modern scholar.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 0.6, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="max-w-xl text-lg md:text-xl lg:text-2xl font-medium leading-relaxed text-base-content/80 mx-auto lg:mx-0"
                        >
                            Access a library of world-class intelligence. Built for institutions that demand excellence and students who seek mastery.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 pt-4"
                    >
                        <Link to="/register" className="w-full sm:w-auto">
                            <button className="btn btn-primary w-full h-14 md:h-16 px-8 md:px-10 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-premium hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] transition-all border-none">
                                Begin Enrollment
                                <HiOutlineArrowRight className="ml-3 w-4 h-4" />
                            </button>
                        </Link>
                        <Link to="/courses" className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-base-content/40 hover:text-primary transition-colors py-4 relative group">
                            Explore Curriculum
                            <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    </motion.div>

                    {/* Subtle stat row */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="flex flex-wrap md:flex-nowrap justify-center lg:justify-start items-center gap-8 md:gap-10 pt-4"
                    >
                        {[
                            { value: '42k+', label: 'Active Scholars' },
                            { value: '300+', label: 'Curated Courses' },
                            { value: '98%', label: 'Satisfaction' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center lg:text-left">
                                <div className="text-lg md:text-xl font-heading font-black text-primary">{stat.value}</div>
                                <div className="text-[8px] md:text-[9px] uppercase font-black tracking-[0.2em] text-base-content/30">{stat.label}</div>
                            </div>
                        ))}
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
                        <div className="w-full h-full rounded-[3.9rem] flex items-center justify-center p-12 overflow-hidden relative group"
                            style={{ background: 'oklch(0.975 0.01 268)' }}>
                            {/* Scholarly Abstract Visual */}
                            <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/5" />
                            {/* Concentric ring decorations */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-primary/8" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 rounded-full border border-primary/12" />
                            <div className="w-full h-full border border-primary/8 rounded-3xl flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700">
                                <span className="text-[240px] font-heading font-black italic text-primary/15 select-none">E</span>
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-[oklch(0.975_0.01_268)] to-transparent" />
                            </div>
                        </div>
                    </div>
                    {/* Floating accent card */}
                    <motion.div
                        animate={{ y: [0, -12, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute z-10 -top-12 -right-12 w-48 h-48 glass rounded-[3rem] p-1 shadow-premium hidden lg:block"
                    >
                        <div className="w-full h-full rounded-[2.8rem] bg-white/50 backdrop-blur-xl flex flex-col items-center justify-center gap-2">
                            <span className="text-3xl font-heading font-black text-primary">42k</span>
                            <span className="text-[8px] uppercase font-black tracking-[0.2em] text-base-content/40">Active Scholars</span>
                        </div>
                    </motion.div>
                    {/* Second floating chip — emerald accent */}
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -bottom-6 -left-8 w-36 h-16 glass rounded-2xl p-1 shadow-premium hidden lg:flex items-center justify-center gap-3"
                    >
                        <div className="w-6 h-6 rounded-lg bg-accent/15 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-accent">Live</div>
                            <div className="text-[8px] font-medium text-base-content/40">300+ Courses</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
