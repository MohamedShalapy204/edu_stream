import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useLogout, useCurrentAccount } from '@/features/auth';
import { useCurrentUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
import { HiOutlineLogout, HiCube } from 'react-icons/hi';
import { LogIn } from 'lucide-react';
import { UserRole } from '@/features/auth';

interface MainLayoutProps {
    isPublic?: boolean;
}

export default function MainLayout({ isPublic = false }: MainLayoutProps) {
    const navigate = useNavigate();
    const { data: account } = useCurrentAccount();
    const { data: profile } = useCurrentUser();
    const { mutate: logout, isPending } = useLogout();

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                navigate('/login', { replace: true });
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="bg-white/80 shadow-sm border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                            <span className="font-black text-xs uppercase tracking-tighter">Es</span>
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">EduStream</h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 mr-auto ml-12">
                        <Link to="/courses" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Courses</Link>
                        {profile?.role === UserRole.TEACHER && (
                            <Link to="/teacher/dashboard" className="flex items-center gap-2 text-sm font-black text-blue-600 hover:text-blue-700 transition-colors">
                                <HiCube className="w-4 h-4" />
                                Teacher Dashboard
                            </Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {account ? (
                            <>
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated As</span>
                                    <span className="text-sm font-bold text-slate-700 leading-none">{account.email}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="h-10 px-4 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                                    leftIcon={<HiOutlineLogout className="h-5 w-5" />}
                                    isLoading={isPending}
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            isPublic && (
                                <Link to="/login">
                                    <Button
                                        variant="primary"
                                        className="h-10 px-6 rounded-xl shadow-lg shadow-blue-500/20"
                                        leftIcon={<LogIn size={18} />}
                                    >
                                        Sign In
                                    </Button>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </header>
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
        </div>
    );
}
