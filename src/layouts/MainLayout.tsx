import { Outlet, useNavigate } from 'react-router-dom';
import { useLogout, useCurrentAccount } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import { HiOutlineLogout } from 'react-icons/hi';

export default function MainLayout() {
    const navigate = useNavigate();
    const { data: account } = useCurrentAccount();
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
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-md shadow-blue-500/20">
                            <span className="font-black text-xs uppercase tracking-tighter">Es</span>
                        </div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight hidden sm:block">EduStream</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        {account && (
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Authenticated As</span>
                                <span className="text-sm font-bold text-slate-700 leading-none">{account.email}</span>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            className="h-10 px-4 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                            leftIcon={<HiOutlineLogout className="h-5 w-5" />}
                            isLoading={isPending}
                            onClick={handleLogout}
                        >
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>
            <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                <Outlet />
            </main>
        </div>
    );
}
