import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
            <h1 className="text-5xl font-extrabold tracking-tight mb-4">EduStream</h1>
            <p className="text-slate-400 text-lg mb-8 max-w-xl text-center">The ultimate learning management platform. Scalable, secure, and built for modern education.</p>

            <div className="flex space-x-4">
                <Link to="/login" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition-colors">
                    Log In
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 font-medium rounded-lg transition-colors border border-slate-700">
                    Sign Up
                </Link>
                <Link to="/dashboard" className="px-6 py-2.5 text-slate-300 hover:text-white font-medium transition-colors">
                    Dashboard
                </Link>
            </div>
        </div>
    );
}
