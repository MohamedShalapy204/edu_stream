import { useCurrentAccount } from '@/features/auth';
import ScholarlyConstellation from './ScholarlyConstellation';
import AtheneumOwl from './AtheneumOwl';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { data: account } = useCurrentAccount();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Slight delay to ensure smooth entry after page load
        const timer = setTimeout(() => {
            requestAnimationFrame(() => setMounted(true));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col justify-center">
            {/* The WebGL/Canvas Particle Background */}
            <ScholarlyConstellation />

            {/* The Physics-driven Owl Companion */}
            <AtheneumOwl />
            
            <div className="relative z-10 w-full max-w-7xl mx-auto p-6 sm:p-20">
                {/* Accent line reveal */}
                <div 
                    className={`h-1.5 w-24 bg-primary mb-12 rounded-full transition-all duration-1000 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                    style={{ transformOrigin: 'left center' }}
                />

                {/* Staggered typography reveals */}
                <h1 
                    className={`display-title text-5xl sm:text-7xl lg:text-8xl text-base-content mb-8 tracking-tighter transition-all duration-1000 delay-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                >
                    Welcome to the <br className="hidden sm:block" />
                    <span className="text-gradient-brand">Atheneum.</span>
                </h1>
                
                <p 
                    className={`body-prose text-2xl font-light text-base-content/70 tracking-wide transition-all duration-1000 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                >
                    Your digital sanctum is active. <br className="hidden sm:block" /> Session authorized for <span className="font-bold text-base-content mx-1">{account?.email || 'Scholar'}</span>.
                </p>

                {/* Animated action buttons */}
                <div 
                    className={`mt-16 flex flex-wrap gap-6 transition-all duration-1000 delay-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                >
                    <button className="flex items-center justify-center gap-4 px-8 py-5 rounded-full bg-primary text-primary-content font-heading font-extrabold text-lg hover:shadow-[0_10px_40px_-10px_var(--color-primary)] hover:-translate-y-1 active:scale-95 transition-all duration-300 group">
                        Resume Studies
                        <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </button>
                    <button className="flex items-center justify-center gap-4 px-8 py-5 rounded-full bg-transparent text-base-content font-heading font-extrabold text-lg border-2 border-base-content/10 hover:border-base-content/30 hover:bg-base-content/5 hover:-translate-y-1 active:scale-95 transition-all duration-300">
                        Explore Catalog
                    </button>
                </div>
            </div>
        </div>
    );
}
