import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

export const LandingCTA: React.FC = () => {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

    // Magnetic button logic
    const buttonRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const yVal = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
    const mouseYSpring = useSpring(yVal, { stiffness: 150, damping: 15, mass: 0.5 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Move towards the cursor, but constrained
        x.set((e.clientX - centerX) * 0.4);
        yVal.set((e.clientY - centerY) * 0.4);
    };

    const handleMouseLeave = () => {
        x.set(0);
        yVal.set(0);
    };

    return (
        <section ref={sectionRef} className="py-32 bg-primary text-primary-content overflow-hidden relative rounded-t-[4rem] -mt-10 perspective-[1000px]">
            {/* Parallax background elements */}
            <motion.div 
                style={{ y }}
                className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" 
            />
            <motion.div 
                style={{ y: useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]) }}
                className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 pointer-events-none" 
            />

            <div className="container mx-auto px-6 lg:px-12 text-center space-y-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <h2 className="text-5xl lg:text-7xl font-heading font-black tracking-tight leading-tight">
                        {t('landing.cta.titlePart1')} <br className="hidden md:block"/>
                        <span className="italic font-medium text-secondary-content relative inline-block">
                            {t('landing.cta.titlePart2')}
                            <motion.span 
                                className="absolute -bottom-2 left-0 right-0 h-1 md:h-2 bg-secondary/40 rounded-full"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
                                style={{ originX: 0 }}
                            />
                        </span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.8, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="max-w-2xl mx-auto text-xl lg:text-2xl font-medium leading-relaxed"
                >
                    {t('landing.cta.description')}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="pt-10 flex justify-center"
                >
                    <Link to="/register" className="inline-block relative">
                        <motion.button
                            ref={buttonRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{ x: mouseXSpring, y: mouseYSpring }}
                            whileTap={{ scale: 0.9 }}
                            className="group relative overflow-hidden btn btn-secondary h-20 px-16 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] border-none"
                        >
                            <span className="relative z-10 block group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                                {t('landing.cta.createAccount')}
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
