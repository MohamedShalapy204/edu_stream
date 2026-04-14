import { useCurrentAccount } from '@/features/auth';

export default function Dashboard() {
    const { data: account } = useCurrentAccount();

    return (
        <div className="py-20">
            <div className="bg-base-100 p-12 rounded-4xl shadow-premium border border-base-content/10">
                <h1 className="text-4xl font-heading font-black text-base-content mb-4 tracking-tight">Welcome back!</h1>
                <p className="text-base-content/60 text-lg font-medium">You are logged in as <span className="font-bold text-primary">{account?.email || 'User'}</span>.</p>
            </div>
        </div>
    );
}
