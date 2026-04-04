import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HiOutlineRocketLaunch, HiOutlineAcademicCap, HiOutlineBookmark } from 'react-icons/hi2';
import type { IAccount } from '@/features/auth';

interface UserLandingProps {
    account: IAccount;
}

export const UserLanding: React.FC<UserLandingProps> = ({ account }) => {
    return (
        <div className="min-h-[80vh] flex flex-col pt-20 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="container mx-auto px-6 lg:px-12">

                {/* Personalized Header */}
                <header className="mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/10"
                    >
                        Welcome Back, Scholar
                    </motion.div>
                    <h1 className="text-5xl lg:text-7xl font-heading font-black tracking-tight text-base-content leading-tight">
                        Continue your journey, <br />
                        <span className="text-primary italic font-medium">{account.name.split(' ')[0]}</span>.
                    </h1>
                </header>

                {/* Dashboard Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Resume Learning */}
                    <Link to="/dashboard" className="group">
                        <div className="p-8 h-full rounded-[2.5rem] bg-white shadow-premium hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/10">
                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                <HiOutlineRocketLaunch className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-heading font-black text-base-content mb-4 tracking-tight">Enter Dashboard</h3>
                            <p className="text-sm font-medium leading-relaxed text-base-content/50">
                                Access your active courses, assignments, and academic progress in the central hub.
                            </p>
                        </div>
                    </Link>

                    {/* Explore Courses */}
                    <Link to="/courses" className="group">
                        <div className="p-8 h-full rounded-[2.5rem] bg-white shadow-premium hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-secondary/10">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
                                <HiOutlineAcademicCap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-heading font-black text-base-content mb-4 tracking-tight">Browse Catalog</h3>
                            <p className="text-sm font-medium leading-relaxed text-base-content/50">
                                Discover new domains of knowledge curated by the world's leading intelligence.
                            </p>
                        </div>
                    </Link>

                    {/* Bookmarks Placeholder */}
                    <div className="p-8 h-full rounded-[2.5rem] bg-base-200/50 border border-dashed border-base-content/10 flex flex-col justify-center items-center text-center opacity-60">
                        <HiOutlineBookmark className="w-10 h-10 text-base-content/20 mb-4" />
                        <span className="text-xs font-black uppercase tracking-widest text-base-content/40">Your Library</span>
                        <p className="text-[10px] font-medium mt-2">Saved resources will appear here.</p>
                    </div>

                </div>

                {/* Motivational Quote */}
                <footer className="mt-32 pt-12 border-t border-base-content/5 text-center sm:text-left">
                    <p className="text-sm font-heading italic text-base-content/40 max-w-lg leading-relaxed">
                        "The Digital Atheneum is not merely a platform, but a sanctuary for the mind. We are honored to be part of your academic mastery."
                    </p>
                </footer>

            </div>
        </div>
    );
};
