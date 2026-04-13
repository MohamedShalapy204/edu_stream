import React from 'react';
import { motion } from 'motion/react';
import {
    HiOutlineAcademicCap,
    HiOutlineShieldCheck,
    HiOutlineCubeTransparent,
    HiOutlineGlobeAlt
} from 'react-icons/hi2';

// ⚠️ Tailwind requires static class strings — never interpolate color tokens.
// Each feature has its own explicit color set for safe purging.
const featureList = [
    {
        title: "Curated Mastery",
        description: "Not just courses, but paths of wisdom. Every curriculum is vetted for maximal scholarly impact and intellectual depth.",
        icon: HiOutlineAcademicCap,
        iconBg: "bg-primary/8",
        iconColor: "text-primary",
        iconHoverBg: "group-hover:bg-primary/15",
        accentBar: "bg-primary",
    },
    {
        title: "Institutional Trust",
        description: "Built on resilient protocols. Your data and progress are safeguarded by advanced encryption and verifiable integrity.",
        icon: HiOutlineShieldCheck,
        iconBg: "bg-accent/8",
        iconColor: "text-accent",
        iconHoverBg: "group-hover:bg-accent/15",
        accentBar: "bg-accent",
    },
    {
        title: "No-Line Interface",
        description: "A frictionless canvas for the mind. We remove the borders between your thoughts and the knowledge they seek.",
        icon: HiOutlineCubeTransparent,
        iconBg: "bg-info/8",
        iconColor: "text-info",
        iconHoverBg: "group-hover:bg-info/15",
        accentBar: "bg-info",
    },
    {
        title: "Global Atheneum",
        description: "Connect with a borderless library of intelligence. A unified platform for the world's most ambitious learners.",
        icon: HiOutlineGlobeAlt,
        iconBg: "bg-secondary/8",
        iconColor: "text-secondary",
        iconHoverBg: "group-hover:bg-secondary/15",
        accentBar: "bg-secondary",
    }
];

export const Features: React.FC = () => {
    return (
        <section className="py-24 lg:py-32 bg-base-200/50">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-2xl mb-20 space-y-4">
                    <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-primary">Fundamental Pillars</h2>
                    <p className="text-4xl lg:text-5xl font-heading font-black tracking-tight text-base-content leading-tight">
                        Curating the future of <span className="text-primary italic font-medium">educational excellence</span>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featureList.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="relative p-8 rounded-[2.5rem] bg-base-200 shadow-premium hover:scale-[1.03] transition-all duration-300 group overflow-hidden"
                        >
                            {/* Colored top-accent bar */}
                            <div className={`absolute top-0 left-8 right-8 h-0.5 ${f.accentBar} opacity-40 rounded-full transition-all duration-300 group-hover:opacity-80 group-hover:left-4 group-hover:right-4`} />

                            <div className={`w-14 h-14 rounded-2xl ${f.iconBg} ${f.iconHoverBg} flex items-center justify-center ${f.iconColor} mb-8 transition-all group-hover:scale-110`}>
                                <f.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-heading font-black text-base-content mb-4 tracking-tight">{f.title}</h3>
                            <p className="text-sm font-medium leading-relaxed text-base-content/50">
                                {f.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
