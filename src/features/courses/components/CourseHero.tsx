import React from 'react';
import { motion } from 'motion/react';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel } from 'react-icons/hi2';

interface CourseHeroProps {
    title: string;
    subtitle: string;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

/**
 * 🏛️ CourseHero
 *
 * An editorial header for the course catalog.
 * Integrated with search and category filtering in a premium scholarly frame.
 */
export const CourseHero: React.FC<CourseHeroProps> = ({
    title,
    subtitle,
    searchQuery,
    onSearchChange,
    categories,
    selectedCategory,
    onCategoryChange
}) => {
    return (
        <section className="relative pt-12 pb-20 border-b border-primary/8 overflow-hidden">
            {/* Subtle indigo tint on the section background */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'linear-gradient(to bottom, oklch(0.975 0.008 268 / 0.6), transparent)' }} />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">

                {/* Heading Block */}
                <div className="max-w-3xl mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/20"
                    >
                        Academic Catalog
                    </motion.div>
                    <h1 className="text-5xl lg:text-7xl font-heading font-black tracking-tighter text-base-content leading-[1.1]">
                        {title}
                    </h1>
                    <p className="text-sm font-medium leading-relaxed text-base-content/50 max-w-xl">
                        {subtitle}
                    </p>
                </div>

                {/* Interaction Toolbar */}
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

                    {/* Search Field */}
                    <div className="relative w-full lg:w-[450px] group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <HiOutlineMagnifyingGlass className="w-5 h-5 text-base-content/25 group-focus-within:text-primary transition-colors duration-300" />
                        </div>
                        <input
                            type="text"
                            placeholder="Identify a domain of study..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-white shadow-premium rounded-2xl text-sm font-bold placeholder:text-base-content/20 border border-transparent focus:border-primary/20 focus:ring-2 focus:ring-primary/8 transition-all outline-none"
                        />
                    </div>

                    {/* Category Filter Ledger */}
                    <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto no-scrollbar py-2">
                        <div className="flex items-center gap-2 pr-4 border-r border-primary/10 text-primary/50">
                            <HiOutlineFunnel className="w-4 h-4" />
                            <span className="text-[10px] uppercase font-black tracking-widest">Filter</span>
                        </div>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => onCategoryChange(cat)}
                                className={`
                                    whitespace-nowrap px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-200 border
                                    ${selectedCategory === cat
                                        ? 'bg-primary text-primary-content border-primary shadow-lg shadow-primary/25 scale-[1.03]'
                                        : 'bg-white text-base-content/40 border-base-content/5 hover:border-primary/20 hover:text-primary hover:bg-primary/4'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
};
