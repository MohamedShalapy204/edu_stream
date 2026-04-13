import React from 'react';

interface StatMeta {
    id: string;
    label: string;
    value: string | number;
}

interface StatsOverviewProps {
    stats: StatMeta[];
}

/**
 * 📊 StatsOverview
 * 
 * Lean, typographic scholarly metrics for the teacher dashboard.
 * Focuses on clarity and editorial weight over decorative icons.
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
    return (
        <div className="flex flex-col md:flex-row gap-16 md:items-end py-4">
            {stats.map((stat) => {
                return (
                    <div
                        key={stat.id}
                        className="flex flex-col group"
                    >
                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                        <div className="flex items-baseline gap-2">
                            <p className="text-5xl font-heading font-black text-base-content tracking-tight leading-none group-hover:text-primary transition-colors duration-500">
                                {stat.value}
                            </p>
                            {/* Optional: Add a subtle trend indicator or unit if needed in future */}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
