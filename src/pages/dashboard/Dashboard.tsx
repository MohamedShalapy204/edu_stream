import { useCurrentAccount } from '@/features/auth';
import { useCurrentUser } from '@/hooks/useUser';
import { UserRole } from '@/types/user';
import ScholarlyConstellation from './ScholarlyConstellation';
import AtheneumOwl from './AtheneumOwl';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// ── Icons ────────────────────────────────────────────────────────────────────
function IconBook() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    );
}
function IconGraduationCap() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}
function IconPlus() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}
function IconCompass() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
    );
}
function IconBarChart() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
        </svg>
    );
}
function IconUsers() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}
function IconArrowRight() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
    );
}
function IconUser() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    );
}

// ── Role chip ────────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: UserRole }) {
    const { t } = useTranslation();
    const isTeacher = role === UserRole.TEACHER;
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
                ${isTeacher
                    ? 'bg-primary/15 text-primary border border-primary/25'
                    : 'bg-accent/15 text-accent border border-accent/25'
                }`}
        >
            {isTeacher ? <IconUsers /> : <IconGraduationCap />}
            {isTeacher ? t('dashboard.instructor') : t('dashboard.scholar')}
        </span>
    );
}

// ── Quick-action card ─────────────────────────────────────────────────────────
interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    variant?: 'primary' | 'ghost';
    delay?: number;
    mounted: boolean;
}
function ActionCard({ icon, title, description, onClick, variant = 'ghost', delay = 0, mounted }: ActionCardProps) {
    return (
        <button
            onClick={onClick}
            className={`group text-left w-full flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300
                hover:-translate-y-1 active:scale-[0.98] cursor-pointer
                ${variant === 'primary'
                    ? 'bg-primary text-primary-content border-primary/20 hover:shadow-[0_12px_40px_-8px_var(--color-primary)]'
                    : 'surface-tinted hover:border-base-content/25 hover:bg-base-100/60'
                }
                transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <span className={`mt-0.5 p-2 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-110
                ${variant === 'primary' ? 'bg-primary-content/15' : 'bg-primary/10 text-primary'}`}>
                {icon}
            </span>
            <div className="flex-1 min-w-0">
                <p className={`font-heading font-bold text-base mb-0.5 ${variant === 'primary' ? 'text-primary-content' : 'text-base-content'}`}>
                    {title}
                </p>
                <p className={`text-sm leading-snug ${variant === 'primary' ? 'text-primary-content/70' : 'text-base-content/60'}`}>
                    {description}
                </p>
            </div>
            <span className={`self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200
                ${variant === 'primary' ? 'text-primary-content' : 'text-primary'}`}>
                <IconArrowRight />
            </span>
        </button>
    );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
    const { t } = useTranslation();
    const { data: account } = useCurrentAccount();
    const { data: user } = useCurrentUser();
    const navigate = useNavigate();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            requestAnimationFrame(() => setMounted(true));
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const isTeacher = user?.role === UserRole.TEACHER;
    const displayName = account?.name || user?.name || 'Scholar';
    const firstName = displayName.split(' ')[0];

    // ── Greeting ──
    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? t('dashboard.goodMorning') :
            hour < 17 ? t('dashboard.goodAfternoon') :
                t('dashboard.goodEvening');

    // ── Teacher actions ──
    const teacherActions = [
        {
            icon: <IconBarChart />,
            title: t('dashboard.teacher.myDashboard'),
            description: t('dashboard.teacher.myDashboardDesc'),
            onClick: () => navigate('/teacher/dashboard'),
            variant: 'primary' as const,
        },
        {
            icon: <IconPlus />,
            title: t('dashboard.teacher.createNewCourse'),
            description: t('dashboard.teacher.createNewCourseDesc'),
            onClick: () => navigate('/teacher/courses/new'),
            variant: 'ghost' as const,
        },
        {
            icon: <IconCompass />,
            title: t('dashboard.teacher.exploreCatalog'),
            description: t('dashboard.teacher.exploreCatalogDesc'),
            onClick: () => navigate('/courses'),
            variant: 'ghost' as const,
        },
        {
            icon: <IconUser />,
            title: t('dashboard.teacher.myProfile'),
            description: t('dashboard.teacher.myProfileDesc'),
            onClick: () => navigate('/profile'),
            variant: 'ghost' as const,
        },
    ];

    // ── Student actions ──
    const studentActions = [
        {
            icon: <IconBook />,
            title: t('dashboard.student.resumeLearning'),
            description: t('dashboard.student.resumeLearningDesc'),
            onClick: () => navigate('/student/dashboard'),
            variant: 'primary' as const,
        },
        {
            icon: <IconCompass />,
            title: t('dashboard.student.exploreCatalog'),
            description: t('dashboard.student.exploreCatalogDesc'),
            onClick: () => navigate('/courses'),
            variant: 'ghost' as const,
        },
        {
            icon: <IconUser />,
            title: t('dashboard.student.myProfile'),
            description: t('dashboard.student.myProfileDesc'),
            onClick: () => navigate('/profile'),
            variant: 'ghost' as const,
        },
    ];

    const actions = isTeacher ? teacherActions : studentActions;

    return (
        <div className="relative min-h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col justify-center">
            {/* WebGL particle background */}
            <ScholarlyConstellation />

            {/* Physics owl companion */}
            <AtheneumOwl />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 sm:px-20">
                <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">

                    {/* ── Left: Hero copy ── */}
                    <div>
                        {/* Accent line */}
                        <div
                            className={`h-1.5 w-24 bg-primary mb-10 rounded-full transition-all duration-1000 delay-200
                                ease-[cubic-bezier(0.16,1,0.3,1)]
                                ${mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
                            style={{ transformOrigin: 'left center' }}
                        />

                        {/* Role badge */}
                        {user?.role && (
                            <div className={`mb-6 transition-all duration-700 delay-300
                                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                <RoleBadge role={user.role} />
                            </div>
                        )}

                        {/* Greeting + name */}
                        <h1
                            className={`display-title text-5xl sm:text-6xl lg:text-7xl text-base-content mb-6
                                tracking-tighter transition-all duration-1000 delay-400
                                ease-[cubic-bezier(0.16,1,0.3,1)]
                                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
                        >
                            {greeting},<br />
                            <span className="text-gradient-brand">{firstName}.</span>
                        </h1>

                        {/* Sub-copy adjusts per role */}
                        <p
                            className={`body-prose text-xl font-light text-base-content/65 tracking-wide
                                transition-all duration-1000 delay-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >
                            {isTeacher
                                ? <>{t('dashboard.teacher.welcome').split('Atheneum')[0]}<strong className="text-base-content font-semibold">Atheneum</strong>{t('dashboard.teacher.welcome').split('Atheneum')[1]}</>
                                : <>{t('dashboard.student.welcome').split('Atheneum')[0]}<strong className="text-base-content font-semibold">Atheneum</strong>{t('dashboard.student.welcome').split('Atheneum')[1]}</>
                            }
                        </p>

                        {/* Stat pills — teacher vs student */}
                        <div className={`mt-10 flex flex-wrap gap-3 transition-all duration-1000 delay-[600ms]
                            ease-[cubic-bezier(0.16,1,0.3,1)]
                             ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {isTeacher ? (
                                <>
                                    <StatPill emoji="🎓" label={t('dashboard.teacher.instructorPortal')} />
                                    <StatPill emoji="📊" label={t('dashboard.teacher.trackAnalytics')} />
                                    <StatPill emoji="✏️" label={t('dashboard.teacher.buildCurriculum')} />
                                </>
                            ) : (
                                <>
                                    <StatPill emoji="📚" label={t('dashboard.student.learnAtPace')} />
                                    <StatPill emoji="🏆" label={t('dashboard.student.earnCertificates')} />
                                    <StatPill emoji="🔬" label={t('dashboard.student.exploreSubjects')} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Right: Action cards ── */}
                    <div
                        className={`flex flex-col gap-3 transition-all duration-1000 delay-700
                            ease-[cubic-bezier(0.16,1,0.3,1)]
                            ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                    >
                        <p className="label-caps mb-2">
                            {isTeacher ? t('dashboard.teacher.actions') : t('dashboard.student.actions')}
                        </p>
                        {actions.map((action, i) => (
                            <ActionCard
                                key={action.title}
                                {...action}
                                delay={800 + i * 80}
                                mounted={mounted}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Small stat pill ───────────────────────────────────────────────────────────
function StatPill({ emoji, label }: { emoji: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full surface-tinted text-sm font-medium text-base-content/75">
            <span>{emoji}</span>
            {label}
        </span>
    );
}
