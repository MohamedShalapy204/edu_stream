import React from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    HiOutlineArrowRightOnRectangle,
    HiOutlineSquares2X2,
    HiOutlineBookOpen,
    HiOutlineUserCircle,
    HiOutlineChevronDown,
    HiOutlineAcademicCap,
    HiOutlineSun,
    HiOutlineMoon
} from 'react-icons/hi2';
import { useLogout, useCurrentAccount, UserRole } from '@/features/auth';
import { useCurrentUser } from '@/hooks/useUser';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/uiSlice';
import { useEffect } from 'react';

interface MainLayoutProps {
    isPublic?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isPublic = false }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.ui.theme);
    const { data: account } = useCurrentAccount();
    const { data: profile } = useCurrentUser();
    const { mutate: logout, isPending } = useLogout();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                navigate('/login', { replace: true });
            }
        });
    };

    const userInitial = account?.name?.[0]?.toUpperCase() || account?.email?.[0]?.toUpperCase() || '?';

    return (
        <div className="min-h-screen bg-base-100 flex flex-col selection:bg-primary/20 font-sans antialiased text-base-content overflow-x-hidden">

            {/* ── STICKY GLASS HEADER ─────────────────────────────────────── */}
            <header className="sticky top-0 z-50 w-full bg-base-100/60 backdrop-blur-2xl transition-all duration-500 border-none shadow-premium/5">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex h-20 items-center justify-between">

                        {/* Brand Section */}
                        <div className="flex items-center gap-12">
                            <Link to="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content text-lg font-black shadow-premium group-hover:scale-105 transition-all">
                                    E
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-heading text-xl font-black tracking-tighter leading-none">EDU<span className="text-primary italic font-medium">stream</span></span>
                                    <span className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/30 mt-0.5">Atheneum Editorial</span>
                                </div>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                {[
                                    { name: 'Library', path: '/courses', icon: HiOutlineBookOpen },
                                ].map((item) => {
                                    const isActive = location.pathname.startsWith(item.path);
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.path}
                                            className={`relative flex items-center gap-2.5 text-[10px] uppercase font-black tracking-[0.25em] transition-all py-2 px-1 ${isActive ? 'text-primary' : 'text-base-content/40 hover:text-base-content'}`}
                                        >
                                            <item.icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            {item.name}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-underline"
                                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}

                                {profile?.role === UserRole.TEACHER && (
                                    <Link
                                        to="/teacher/dashboard"
                                        className={`flex items-center gap-2.5 text-[10px] uppercase font-black tracking-[0.25em] py-2 px-4 rounded-xl transition-all ${location.pathname.startsWith('/teacher') ? 'bg-primary/10 text-primary shadow-premium' : 'text-base-content/40 hover:bg-base-200'}`}
                                    >
                                        <HiOutlineSquares2X2 className="w-4 h-4" />
                                        Faculty Dashboard
                                    </Link>
                                )}

                                {profile?.role === UserRole.STUDENT && (
                                    <Link
                                        to="/student/dashboard"
                                        className={`flex items-center gap-2.5 text-[10px] uppercase font-black tracking-[0.25em] py-2 px-4 rounded-xl transition-all ${location.pathname.startsWith('/student') ? 'bg-primary/10 text-primary shadow-premium' : 'text-base-content/40 hover:bg-base-200'}`}
                                    >
                                        <HiOutlineAcademicCap className="w-4 h-4" />
                                        Learning Portal
                                    </Link>
                                )}
                            </nav>
                        </div>

                        {/* Actions Section */}
                        <div className="flex items-center gap-6">
                            {/* Theme Toggle Button */}
                            <button
                                onClick={() => dispatch(toggleTheme())}
                                className="w-10 h-10 rounded-xl bg-base-200 flex items-center justify-center text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all shadow-premium/5 group"
                                aria-label="Toggle Theme"
                            >
                                {theme === 'light' ? (
                                    <HiOutlineMoon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <HiOutlineSun className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                )}
                            </button>
                            {account ? (
                                <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="group flex items-center gap-4 cursor-pointer p-1 rounded-2xl hover:bg-base-200 transition-all">
                                        <div className="flex-col items-end text-right hidden sm:flex">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-base-content/30">Scholar</span>
                                            <span className="text-xs font-black tracking-tight">{account.name || 'Anonymous'}</span>
                                        </div>
                                        {/* Scholarly Tile (Avatar) */}
                                        <div className="w-10 h-10 rounded-[0.8rem] bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-content text-sm font-black shadow-premium group-hover:scale-105 transition-all">
                                            {userInitial}
                                        </div>
                                        <HiOutlineChevronDown className="w-3.5 h-3.5 text-base-content/20 group-hover:text-primary transition-all mr-1" />
                                    </label>

                                    <ul tabIndex={0} className="dropdown-content z-50 menu p-3 shadow-premium bg-base-100 rounded-3xl w-64 mt-4 border border-base-content/5 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="px-4 py-3 border-b border-base-content/5 mb-2">
                                            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/30 mb-1">Authenticated Account</p>
                                            <p className="text-xs font-bold truncate">{account.email}</p>
                                        </div>
                                        {profile?.role === UserRole.STUDENT && (
                                            <li>
                                                <Link to="/student/dashboard" className="flex items-center gap-3 h-12 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary">
                                                    <HiOutlineAcademicCap className="w-5 h-5" />
                                                    Learning Portal
                                                </Link>
                                            </li>
                                        )}
                                        {profile?.role === UserRole.TEACHER && (
                                            <li>
                                                <Link to="/teacher/dashboard" className="flex items-center gap-3 h-12 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary">
                                                    <HiOutlineSquares2X2 className="w-5 h-5" />
                                                    Faculty Dashboard
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link to="/profile" className="flex items-center gap-3 h-12 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/5 hover:text-primary">
                                                <HiOutlineUserCircle className="w-5 h-5" />
                                                Personal Dossier
                                            </Link>
                                        </li>
                                        <li className="mt-2">
                                            <button
                                                onClick={handleLogout}
                                                disabled={isPending}
                                                className="flex items-center gap-3 h-12 rounded-xl text-xs font-black uppercase tracking-widest text-error hover:bg-error/5"
                                            >
                                                {isPending ? <span className="loading loading-spinner loading-xs" /> : <HiOutlineArrowRightOnRectangle className="w-5 h-5" />}
                                                Revoke Session
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                isPublic && (
                                    <Link to="/login">
                                        <button className="btn btn-primary h-12 rounded-2xl px-6 font-black text-xs uppercase tracking-[0.25em] shadow-premium hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all border-none">
                                            Identify
                                            <HiOutlineArrowRightOnRectangle className="ml-2 w-4 h-4" />
                                        </button>
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
            <main className="flex-1 w-full bg-base-100 relative">
                {/* Global Background Decorations */}
                <div className="absolute inset-0 -z-10 pointer-events-none opacity-20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-160 h-160 rounded-full blur-[120px] bg-primary/10 -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-120 h-120 rounded-full blur-[100px] bg-secondary/10 translate-y-1/3 -translate-x-1/4" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                    <Outlet />
                </div>
            </main>

            {/* ── FOOTER ─────────────────────────────────────────────────── */}
            <footer className="py-12 bg-base-200/30">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3 opacity-30 grayscale saturate-0 hover:opacity-100 hover:grayscale-0 hover:saturate-100 transition-all cursor-default">
                        <div className="w-6 h-6 rounded-lg bg-base-content flex items-center justify-center text-base-100 text-[8px] font-black">E</div>
                        <span className="text-[10px] uppercase font-black tracking-[0.3em]">EDUstream Intelligence</span>
                    </div>
                    <div className="text-[10px] uppercase font-black tracking-[0.2em] text-base-content/20">
                        &copy; 2026 Digital Atheneum. All Protocols Reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
