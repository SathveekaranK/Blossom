import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Sparkles, CheckCircle2, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { user, token } = response.data;

            setIsSuccess(true);
            setTimeout(() => {
                setAuth(user, token);
                navigate('/');
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden border-2 border-white/40">
                    <AnimatePresence mode="wait">
                        {!isSuccess ? (
                            <motion.div
                                key="register-form"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="flex flex-col gap-3 text-center relative">
                                    <Link
                                        to="/"
                                        className="absolute -top-6 -right-6 p-2 bg-white/50 backdrop-blur-md rounded-full text-dark/40 hover:text-dark hover:bg-white transition-all shadow-sm group border border-white/40"
                                        title="Exit Registration"
                                    >
                                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    </Link>
                                    <div className="w-16 h-16 bg-secondary/20 rounded-3xl flex items-center justify-center text-secondary self-center mb-2">
                                        <Sparkles className="w-8 h-8 fill-secondary" />
                                    </div>
                                    <h1 className="text-3xl font-black text-dark tracking-tight">Create Identity.</h1>
                                    <p className="text-gray-500 font-medium text-sm">Join Blossom for personal beauty recommendations.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-gray-50 rounded-3xl focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-dark text-sm"
                                                placeholder="Evelyn Blossom"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-gray-50 rounded-3xl focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-dark text-sm"
                                                placeholder="evelyn@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Secure Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-secondary transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-14 pr-6 py-3.5 bg-white border-2 border-gray-50 rounded-3xl focus:border-secondary focus:outline-none focus:ring-4 focus:ring-secondary/10 transition-all font-medium text-dark text-sm"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-red-500 text-[11px] font-bold bg-red-50 p-3 rounded-2xl border border-red-100 flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" />
                                            {error}
                                        </motion.p>
                                    )}

                                    <button
                                        disabled={isLoading}
                                        className="group relative w-full py-4 bg-dark text-white rounded-3xl font-black hover:bg-secondary transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-secondary/30 disabled:opacity-70 flex items-center justify-center gap-3 overflow-hidden mt-2"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Become a Member.</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="text-center text-xs font-medium text-gray-400">
                                    Already a member? <Link to="/login" className="text-secondary font-black hover:text-secondary-dark transition-colors">Sign in</Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success-reg"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 gap-6 text-center"
                            >
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-primary relative">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    >
                                        <CheckCircle2 className="w-16 h-16 stroke-[1.5]" />
                                    </motion.div>
                                    <motion.div
                                        className="absolute inset-0 border-4 border-primary/30 rounded-full"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.5, opacity: 0 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-3xl font-black text-dark tracking-tight">Welcome, {name.split(' ')[0]}!</h2>
                                    <p className="text-gray-500 font-bold">Your account has been flowered.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex flex-col items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-200">B L O S S O M — S T U D I O</span>
                    <div className="flex gap-4">
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                        <div className="w-1 h-1 rounded-full bg-gray-200" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
