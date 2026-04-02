import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useLogout, useCurrentAccount } from '@/features/auth';
import { useCurrentUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
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
        <div className="min-h-screen bg-[#f1f4f8] flex flex-col">
            {/* Header: Digital Atheneum style — tonal backgrounds, no borders */}
            <header className="bg-white/80 shadow-[0_1px_16px_rgba(0,0,0,0.02)] sticky top-0 z-10 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex justify-between items-center">

                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-[#4e45e4] p-1.5 h-8 w-8 rounded-lg text-white shadow-lg shadow-[#4e45e4]/10 group-hover:scale-105 transition-transform flex items-center justify-center font-bold text-xs uppercase">
                            E
                        </div>
                        <h1 className="text-lg font-bold text-[#2d3338] tracking-tight hidden sm:block">EduStream</h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-10 mr-auto ml-16">
                        <Link to="/courses" className="text-xs font-bold uppercase tracking-widest text-[#adb3b8] hover:text-[#4e45e4] transition-colors">Courses</Link>
                        {profile?.role === UserRole.TEACHER && (
                            <Link to="/teacher/dashboard" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#4e45e4] hover:text-[#3d36b8] transition-colors">
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
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#adb3b8] leading-none mb-1">Authenticated As</span>
                                    <span className="text-xs font-bold text-[#2d3338] leading-none">{account.email}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    className="h-10 px-4 text-[#adb3b8] hover:text-[#e11d48] hover:bg-rose-50/50"
                                    leftIcon={<HiOutlineArrowRightOnRectangle size={19} />}
                                    isLoading={isPending}
                                    onClick={handleLogout}
                                >
                                    <span className="text-xs">Sign Out</span>
                                </Button>
                            </>
                        ) : (
                            isPublic && (
                                <Link to="/login">
                                    <Button
                                        variant="primary"
                                        className="h-10 px-6"
                                        rightIcon={<HiArrowRightOnRectangle size={17} />}
                                    >
                                        Sign In
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

// Minimal HiArrowRightOnRectangle fallback if needed since we had an import error with hi2 previously
const HiArrowRightOnRectangle = ({ size, className }: { size?: number, className?: string }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
);
