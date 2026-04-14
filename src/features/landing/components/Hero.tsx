import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles, HiOutlineBookOpen, HiOutlineGlobeAlt, HiOutlineAcademicCap } from 'react-icons/hi2';

export const Hero: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll();
    
    // Smooth scroll for parallax
    const y = useTransform(scrollY, [0, 1000], [0, 300]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    // Spring-based mouse tracking for tilt effect on the main visual
    const x = useMotionValue(0);
    const yVal = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
    const mouseYSpring = useSpring(yVal, { stiffness: 150, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        yVal.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        yVal.set(0);
    };

    return (
        <section ref={containerRef} className="relative pt-24 pb-40 overflow-visible perspective-[2000px]">
            {/* Ambient background glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden z-0">
                <motion.div 
                    style={{ y, opacity }}
                    className="absolute top-[-20%] left-1/4 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[160px]" 
                />
                <motion.div 
                    style={{ y: useTransform(y, (val) => val * -0.5), opacity }}
                    className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]" 
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16 md:gap-20 relative z-10">
                
                {/* Text Content */}
                <div className="flex-1 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs uppercase font-black tracking-[0.25em] shadow-[0_0_20px_rgba(var(--color-primary),0.2)] ring-1 ring-primary/30 backdrop-blur-md"
                    >
                        <HiOutlineSparkles className="w-4 h-4 text-accent" />
                        The Digital Atheneum is Open
                    </motion.div>

                    <div className="space-y-8 relative">
                        {/* Decorative line tracking the headline */}
                        <motion.div 
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute -left-6 lg:-left-8 top-2 bottom-2 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full hidden lg:block origin-top"
                        />
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-[5.5rem] xl:text-[6rem] font-heading font-black leading-[0.95] md:leading-[0.9] tracking-tighter text-base-content"
                        >
                            Knowledge,<br />
                            <span className="text-primary italic font-medium relative inline-block">
                                curated
                                <motion.span 
                                    className="absolute -bottom-2 left-0 right-0 h-[6px] bg-accent/40 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
                                    style={{ originX: 0 }}
                                />
                            </span><br />
                            for the modern scholar.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 0.7, y: 0 }}
                            transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.2 }}
                            className="max-w-2xl text-xl md:text-2xl font-medium leading-relaxed text-base-content/80 mx-auto lg:mx-0"
                        >
                            Access a library of world-class intelligence. Built for institutions that demand excellence and students who seek mastery.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-6 pt-4"
                    >
                        <Link to="/register" className="w-full sm:w-auto z-20">
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative overflow-hidden btn btn-primary w-full h-16 px-10 rounded-[1.25rem] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] shadow-[0_0_40px_-10px_rgba(var(--color-primary),0.5)] border-none"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Begin Enrollment
                                    <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                {/* Glossy sheen effect on hover */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                            </motion.button>
                        </Link>
                        
                        <Link to="/courses" className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-base-content/50 hover:text-primary transition-colors py-4 relative group">
                            Explore Curriculum
                            <span className="absolute bottom-2 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    </motion.div>
                </div>

                {/* Tactile Decorative Visual */}
                <div className="flex-1 relative hidden lg:block perspective-[1200px]" style={{ zIndex: 30 }}>
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 20, delay: 0.4 }}
                        className="relative z-10 w-full aspect-square max-w-[550px] mx-auto rounded-[3rem] cursor-grab active:cursor-grabbing"
                    >
                        {/* The Main "Book" / Repository Element */}
                        <div 
                            className="absolute inset-0 bg-base-100/80 backdrop-blur-2xl rounded-[3rem] border border-primary/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
                            style={{ transform: "translateZ(-20px)" }}
                        >
                            {/* Inner graphical grid */}
                            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                            
                            <div className="absolute top-0 left-0 w-full h-full p-12 flex flex-col justify-between">
                                <div className="flex justify-between items-center opacity-40">
                                    <HiOutlineAcademicCap className="w-8 h-8 text-primary" />
                                    <div className="text-[10px] font-black tracking-widest uppercase">Vol. IV</div>
                                </div>
                                <div className="text-center group">
                                    <span className="text-[180px] font-heading font-black italic text-primary/10 select-none group-hover:text-primary/20 transition-colors duration-500 block leading-none">Æ</span>
                                    <div className="text-xs uppercase tracking-[0.4em] font-black text-base-content/30 mt-4">The Repository</div>
                                </div>
                                <div className="w-full h-1 bg-primary/10 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-primary"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Floating Draggable Elements (Tactile) */}
                        <motion.div
                            drag
                            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95, cursor: "grabbing" }}
                            style={{ transform: "translateZ(80px)" }}
                            className="absolute -top-8 -right-8 w-40 h-40 glass bg-base-100/90 rounded-[2rem] p-6 shadow-premium border border-primary/10 flex flex-col items-center justify-center gap-2 cursor-grab"
                        >
                            <HiOutlineGlobeAlt className="w-8 h-8 text-accent mb-1" />
                            <span className="text-3xl font-heading font-black text-base-content">42k</span>
                            <span className="text-[8px] uppercase font-black tracking-[0.2em] text-base-content/40 text-center">Active<br/>Scholars</span>
                        </motion.div>

                        <motion.div
                            drag
                            dragConstraints={{ left: -30, right: 30, top: -30, bottom: 30 }}
                            dragElastic={0.2}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95, cursor: "grabbing" }}
                            style={{ transform: "translateZ(120px)" }}
                            className="absolute bottom-12 -left-12 w-48 py-4 px-5 glass bg-base-100/95 rounded-2xl shadow-premium border border-accent/20 flex items-center justify-start gap-4 cursor-grab z-10"
                        >
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 flex-shrink-0">
                                <HiOutlineBookOpen className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Curriculum</div>
                                <div className="text-[11px] font-medium text-base-content/60">300+ Verified Courses</div>
                            </div>
                        </motion.div>
                        
                    </motion.div>
                </div>
            </div>
            
            {/* Added custom shimmer animation globally or inline */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}} />
        </section>
    );
};
