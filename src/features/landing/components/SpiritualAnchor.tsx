import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

export const SpiritualAnchor: React.FC = () => {
    const { t } = useTranslation();
    const containerRef = React.useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax values for a "living" background
    const glowY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
    const videoScale = useTransform(scrollYProgress, [0, 0.4, 0.6], [0.9, 1, 1]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section 
            ref={containerRef}
            className="relative py-40 overflow-hidden bg-base-100 min-h-screen flex flex-col items-center justify-center"
        >
            {/* Animated Background Layers */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div 
                    style={{ y: glowY }}
                    className="absolute top-0 left-[-10%] w-[800px] h-[800px] rounded-full bg-primary/10 blur-[160px]" 
                />
                <motion.div 
                    style={{ y: useTransform(glowY, (v) => -v * 1.5) }}
                    className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[140px]" 
                />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 flex flex-col items-center gap-20">
                
                {/* Centered Editorial Header */}
                <motion.div 
                    style={{ opacity: textOpacity }}
                    className="text-center max-w-4xl space-y-8"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-xs uppercase font-black tracking-[0.2em] ring-1 ring-primary/20 backdrop-blur-md"
                    >
                        <HiOutlineSparkles className="w-4 h-4 text-accent animate-pulse" />
                        {t('landing.sanctuary.badge')}
                    </motion.div>
                    
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-base-content leading-[0.95] tracking-tighter">
                        {t('landing.sanctuary.title')} <br />
                        <span className="text-primary italic font-medium relative inline-block">
                            {t('landing.sanctuary.titleAccent')}
                            <motion.span 
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                                style={{ originX: 0 }}
                                className="absolute -bottom-2 left-0 right-0 h-[8px] bg-accent/30 rounded-full"
                            />
                        </span>
                    </h2>

                    <p className="body-prose text-xl md:text-2xl text-base-content/60 mx-auto max-w-2xl leading-relaxed">
                        {t('landing.sanctuary.description')}
                    </p>
                </motion.div>

                {/* The "Full Width" Cinematic Theater */}
                <motion.div 
                    style={{ scale: videoScale }}
                    className="w-full max-w-6xl relative flex justify-center perspective-[2000px]"
                >
                    {/* The Bezel Structure */}
                    <div className="relative aspect-[9/16] w-full max-w-[500px] group">
                        
                        {/* Dynamic Aura Glow */}
                        <div className="absolute -inset-10 bg-primary/20 rounded-[5rem] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 100, rotateX: 20 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ type: "spring", stiffness: 50, damping: 20 }}
                            className="relative h-full w-full bg-base-300 rounded-[4rem] p-4 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6),_inset_0_2px_0_rgba(255,255,255,0.1)] border border-primary/30 overflow-hidden backdrop-blur-2xl"
                        >
                            {/* Inner Depth Shadow */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] z-10 rounded-[3.2rem]" />
                            
                            <div className="w-full h-full rounded-[3.2rem] overflow-hidden bg-black relative">
                                <video 
                                    src="/videos/quran-reflection.mp4"
                                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    controls
                                    playsInline
                                    loop
                                    muted={false}
                                />
                                {/* Cinematic Texture Overlay */}
                                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-40 mix-blend-overlay" />
                            </div>
                        </motion.div>

                        {/* Floating Labels that drift with scroll */}
                        <motion.div 
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute -right-12 bottom-1/4 py-4 px-6 glass bg-base-100/90 rounded-[2rem] border border-primary/20 shadow-premium z-20 hidden lg:block"
                        >
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">{t('landing.sanctuary.source')}</div>
                            <div className="text-sm font-medium text-base-content/70 italic">@quran.moaz.1</div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1, type: "spring" }}
                            className="absolute -left-12 top-1/4 py-4 px-6 glass bg-base-100/90 rounded-[2rem] border border-accent/20 shadow-premium z-20 hidden lg:block"
                        >
                            <HiOutlineSparkles className="w-6 h-6 text-accent mb-2" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Interactive Reflection</div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Staggered Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl pt-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="p-8 rounded-[2.5rem] bg-base-200/50 border border-primary/10 hover:bg-base-200 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-xl font-black text-primary">01</span>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-base-content mb-3">{t('landing.sanctuary.momentumTitle')}</h4>
                        <p className="text-sm text-base-content/50 leading-relaxed">{t('landing.sanctuary.momentumDesc')}</p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="p-8 rounded-[2.5rem] bg-base-200/50 border border-accent/10 hover:bg-base-200 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="text-xl font-black text-accent">02</span>
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-tight text-base-content mb-3">{t('landing.sanctuary.stillnessTitle')}</h4>
                        <p className="text-sm text-base-content/50 leading-relaxed">{t('landing.sanctuary.stillnessDesc')}</p>
                    </motion.div>
                </div>

            </div>
            
            {/* Cinematic Gradient Fade-out */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-base-100 to-transparent z-20" />
        </section>
    );
};
