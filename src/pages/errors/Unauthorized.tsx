import { Link } from 'react-router-dom';

export default function Unauthorized() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-black text-rose-500 mb-2">403</h1>
            <p className="text-slate-600 text-xl mb-6">You don't have permission to access this resource.</p>
            <div className="flex space-x-4">
                <Link to="/dashboard" className="text-blue-600 hover:underline font-medium">Go to Dashboard</Link>
            </div>
        </div>
    );
}
