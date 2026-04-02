import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useLogout, useCurrentAccount } from '@/features/auth';
import { useCurrentUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { HiOutlineArrowRightOnRectangle, HiOutlineSquares2X2 } from 'react-icons/hi2';
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
        <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
            {/* Header: Digital Atheneum style — tonal backgrounds, no borders */}
            <header className="bg-white/80 dark:bg-surface-900/80 shadow-[0_1px_16px_rgba(0,0,0,0.02)] sticky top-0 z-10 backdrop-blur-xl transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-primary p-1.5 h-8 w-8 rounded-lg text-primary-foreground shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform flex items-center justify-center font-bold text-xs uppercase">
                            E
                        </div>
                        <h1 className="text-lg font-bold text-foreground tracking-tight hidden sm:block">EduStream</h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-10 mr-auto ml-16">
                        <Link to="/courses" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Courses</Link>
                        {profile?.role === UserRole.TEACHER && (
                            <Link to="/teacher/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-700 transition-colors">
                                <HiOutlineSquares2X2 className="w-4 h-4" />
                                Teacher Dashboard
                            </Link>
                        )}
                    </nav>

                    {/* Meta/Auth Actions */}
                    <div className="flex items-center space-x-6">
                        {account ? (
                            <>
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground leading-none mb-1">Authenticated As</span>
                                    <span className="text-xs font-bold text-foreground leading-none">{account.email}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="h-10 px-4 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-300"
                                    disabled={isPending}
                                    onClick={handleLogout}
                                >
                                    {isPending ? (
                                        <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <HiOutlineArrowRightOnRectangle size={19} className="mr-2" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            isPublic && (
                                <Link to="/login">
                                    <Button
                                        variant="default"
                                        className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all duration-300"
                                    >
                                        Sign In
                                        <HiOutlineArrowRightOnRectangle size={17} className="ml-2" />
                                    </Button>
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </header>

            {/* Content Area */}
            <main className="grow max-w-7xl w-full mx-auto px-6 lg:px-12 py-10">
                <Outlet />
            </main>
        </div>
    );
}
