import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';
import { loginSchema, type LoginInput } from '../../utils/validation';
import { useLogin } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { mutate: login, isPending, error, reset } = useLogin();
    const [authError, setAuthError] = useState<string | null>(null);

    // Redirect logic: check if there's a "from" location or default to dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = (data: LoginInput) => {
        setAuthError(null);
        reset(); // Clear useMutation error

        login(data, {
            onSuccess: () => {
                navigate(from, { replace: true });
            },
            onError: (err: any) => {
                // If it's a 401, error message is handled by hooks
                setAuthError(err.message || 'An unexpected error occurred during sign in.');
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 selection:bg-blue-100 selection:text-blue-900">
            {/* Branding / Header */}
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                <Link to="/" className="inline-flex items-center gap-2 group">
                    <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg ring-4 ring-blue-50 group-hover:bg-blue-700 group-hover:scale-105 transition-all duration-300">
                        <HiLockClosed className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900 font-display">
                        Edu<span className="text-blue-600 italic">Stream</span>
                    </span>
                </Link>
            </div>

            {/* Auth Card */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-blue-900/5 ring-1 ring-slate-200/60 max-w-md w-full animate-in zoom-in-95 duration-500 delay-150 fill-mode-both border border-slate-100/50">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Welcome back</h1>
                <p className="text-slate-500 mb-8 font-medium">Enter your credentials to access your workspace.</p>

                {/* Global Errors */}
                {(authError || error) && (
                    <Alert
                        type="error"
                        message={authError || (error as any)?.message}
                        onClose={() => setAuthError(null)}
                    />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <Input
                        label="Email Address"
                        placeholder="name@work.com"
                        type="email"
                        autoComplete="email"
                        icon={<HiMail className="h-5 w-5" />}
                        error={errors.email?.message}
                        {...register('email')}
                    />

                    <div className="space-y-1">
                        <Input
                            label="Password"
                            placeholder="••••••••"
                            type="password"
                            autoComplete="current-password"
                            icon={<HiLockClosed className="h-5 w-5" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />
                        <div className="flex justify-end p-1">
                            <Link
                                to="/forgot-password"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 decoration-blue-600/30 hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        className="w-full h-12 shadow-lg shadow-blue-500/10 text-base"
                        isLoading={isPending}
                        rightIcon={<HiArrowRight className="h-5 w-5" />}
                        type="submit"
                    >
                        Sign In to Account
                    </Button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-sm font-medium text-slate-600">
                        Don't have an account yet?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:text-blue-700 font-bold decoration-blue-600/30 hover:underline transition-colors ml-1"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-slate-400 text-xs font-medium uppercase tracking-widest leading-loose max-w-xs animate-in fade-in duration-1000">
                Secure enterprise grade encryption powered by Appwrite
            </div>
        </div>
    );
};

export default LoginPage;
