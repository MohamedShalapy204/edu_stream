import React from 'react';
import { motion } from 'motion/react';

interface ProgressBarProps {
    progress: number;
    label?: string;
    showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    label = 'Processing...',
    showPercentage = true
}) => {
    const normalizedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-base-content/60">
                <span>{label}</span>
                {showPercentage && <span className="text-primary">{Math.round(normalizedProgress)}%</span>}
            </div>
            <div className="h-2 w-full bg-base-100 rounded-full overflow-hidden shadow-inner ring-1 ring-base-content/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${normalizedProgress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                    className="h-full bg-primary relative overflow-hidden"
                >
                    {/* Glossy overlay effect */}
                    <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </motion.div>
            </div>
        </div>
    );
};
