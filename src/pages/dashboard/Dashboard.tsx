import { useCurrentAccount } from '../../hooks/useAuth';

export default function Dashboard() {
    const { data: account } = useCurrentAccount();

    return (
        <div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back!</h1>
                <p className="text-slate-600">You are logged in as <span className="font-semibold text-slate-900">{account?.email || 'User'}</span>.</p>
            </div>
        </div>
    );
}
