import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { HiOutlineRocketLaunch, HiOutlineAcademicCap, HiOutlineBookmark } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';
import type { IAccount } from '@/features/auth';
import { SpiritualAnchor } from './SpiritualAnchor';

interface UserLandingProps {
    account: IAccount;
}

// Each shortcut card has a distinct, purposeful color identity
const shortcuts = [
    {
        to: '/dashboard',
        icon: HiOutlineRocketLaunch,
        key: 'enterDashboard',
        iconBg: 'bg-primary/8',
        iconColor: 'text-primary',
        iconHoverBg: 'group-hover:bg-primary/15',
        hoverBorder: 'hover:border-primary/15',
        hoverRing: 'group-hover:shadow-primary/8',
        accentTop: 'bg-primary',
    },
    {
        to: '/courses',
        icon: HiOutlineAcademicCap,
        key: 'browseCatalog',
        iconBg: 'bg-accent/8',
        iconColor: 'text-accent',
        iconHoverBg: 'group-hover:bg-accent/15',
        hoverBorder: 'hover:border-accent/15',
        hoverRing: 'group-hover:shadow-accent/8',
        accentTop: 'bg-accent',
    },
];

export const UserLanding: React.FC<UserLandingProps> = ({ account }) => {
    const { t } = useTranslation();

    return (
        <div className="min-h-[80vh] flex flex-col pt-12 md:pt-20 pb-20 md:pb-32 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-full">
 
                {/* Personalized Header */}
                <header className="mb-12 md:mb-20 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em] shadow-sm ring-1 ring-primary/20"
                    >
                        {t('userLanding.welcome')}
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-black tracking-tight text-base-content leading-tight italic">
                        {t('userLanding.continueJourney')} <br />
                        <span className="text-primary not-italic font-medium">{account.name.split(' ')[0]}</span>.
                    </h1>
                </header>

                {/* Dashboard Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {shortcuts.map((s) => (
                        <Link key={s.to} to={s.to} className="group">
                            <div className={`relative p-8 h-full rounded-[2.5rem] bg-base-200 shadow-premium hover:shadow-2xl transition-all duration-300 border border-transparent ${s.hoverBorder} overflow-hidden`}>
                                {/* Colored top accent bar */}
                                <div className={`absolute top-0 left-8 right-8 h-0.5 ${s.accentTop} opacity-30 rounded-b-full group-hover:opacity-70 group-hover:left-4 group-hover:right-4 transition-all duration-300`} />

                                <div className={`w-14 h-14 rounded-2xl ${s.iconBg} ${s.iconHoverBg} flex items-center justify-center ${s.iconColor} mb-8 group-hover:scale-110 transition-all duration-300`}>
                                    <s.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-heading font-black text-base-content mb-4 tracking-tight group-hover:text-primary transition-colors duration-300">{t(`userLanding.${s.key}`)}</h3>
                                <p className="text-sm font-medium leading-relaxed text-base-content/50">
                                    {t(`userLanding.${s.key}Desc`)}
                                </p>
                            </div>
                        </Link>
                    ))}

                    {/* Your Library — placeholder with a distinct muted style */}
                    <div className="p-8 h-full rounded-[2.5rem] bg-base-200/40 border border-dashed border-primary/10 flex flex-col justify-center items-center text-center opacity-50 hover:opacity-70 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-2xl bg-base-content/5 flex items-center justify-center mb-6">
                            <HiOutlineBookmark className="w-7 h-7 text-base-content/20" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-base-content/40">{t('userLanding.yourLibrary')}</span>
                        <p className="text-[10px] font-medium mt-2 text-base-content/30 max-w-48">{t('userLanding.yourLibraryDesc')}</p>
                    </div>

                </div>

                <SpiritualAnchor />

                {/* Motivational Quote */}
                 <footer className="mt-32 pt-12 border-t border-primary/8 text-center sm:text-left">
                    {/* Thin indigo rule above quote */}
                    <div className="w-12 h-0.5 bg-primary/30 mb-6 hidden sm:block rounded-full" />
                    <p className="text-sm font-heading italic text-base-content/40 max-w-lg leading-relaxed">
                        {t('userLanding.footerQuote')}
                    </p>
                </footer>

            </div>
        </div>
    );
};
