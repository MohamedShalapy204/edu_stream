import React from 'react';
import { HiAcademicCap, HiCube, HiChartBar } from 'react-icons/hi2';

interface StatMeta {
    id: string;
    label: string;
    value: string | number;
}

interface StatsOverviewProps {
    stats: StatMeta[];
}

const STAT_ICONS: Record<string, React.ElementType> = {
    learners: HiAcademicCap,
    courses: HiCube,
    revenue: HiChartBar,
};

const STAT_COLORS: Record<string, string> = {
    learners: 'text-primary bg-primary/5',
    courses: 'text-secondary bg-secondary/5',
    revenue: 'text-success bg-success/5',
};

/**
 * 📊 StatsOverview
 * 
 * High-fidelity scholarly metrics for the teacher dashboard.
 * Features glassmorphic cards and buttery-smooth interactions.
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {stats.map((stat) => {
                const Icon = STAT_ICONS[stat.id] || SC_FallbackIcon;
                const colorClass = STAT_COLORS[stat.id] || 'text-muted-foreground bg-surface-50';

                return (
                    <div
                        key={stat.id}
                        className="bg-white/40 backdrop-blur-3xl p-8 rounded-[2.5rem] shadow-premium flex items-center gap-6 group hover:shadow-xl transition-all duration-500 ring-1 ring-base-content/5"
                    >
                        <div className={`${colorClass} p-5 h-16 w-16 rounded-[1.25rem] flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm border border-white/40`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-base-content/30 uppercase tracking-[0.25em] mb-1.5">{stat.label}</p>
                            <p className="text-3xl font-heading font-black text-base-content tracking-tighter leading-none">{stat.value}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SC_FallbackIcon = () => <div className="w-7 h-7 bg-current rounded-full" />;
