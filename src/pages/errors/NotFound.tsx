import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-6xl font-black text-slate-900 mb-2">404</h1>
            <p className="text-slate-600 text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>
            <Link to="/" className="text-blue-600 hover:underline font-medium">Return Home</Link>
        </div>
    );
}
