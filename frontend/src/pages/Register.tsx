import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Loader2, ChevronRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import api from '../api/api';

const Register = () => {
    const { setAuth, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Registration Form, 2: OTP Verification
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [otp, setOtp] = useState('');
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
    }

    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await api.post('/auth/register', formData);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) return;
        setIsVerifyingOtp(true);
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', { email: formData.email, otp });
            const { user, token } = res.data;
            setAuth(user, token);
            await useCartStore.getState().fetchCartFromDB();
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired OTP.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        setError('');
        try {
            await api.post('/auth/resend-otp', { email: formData.email });
        } catch (err: any) {
            setError('Failed to resend OTP.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center gap-8 mb-12">
                    <Link to="/login" className="w-12 h-12 rounded-2xl bg-dark text-white flex items-center justify-center hover:bg-primary transition-all duration-500 shadow-xl shadow-black/10">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-4xl font-black text-dark tracking-tighter text-center">
                            {step === 1 ? 'Join Blossom.' : 'Check Your Inbox.'}
                        </h1>
                        <p className="text-gray-400 font-medium text-center">
                            {step === 1 ? 'Create your professional skin care account' : `We've sent a 6-digit code to ${formData.email}`}
                        </p>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-xs font-bold">{error}</span>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="register-form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleInitialSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-widest flex items-center gap-2">
                                    <UserIcon className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-widest flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email Address
                                </label>
                                <input
                                    type="email" required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-widest flex items-center gap-2">
                                    <Lock className="w-3 h-3" /> Password
                                </label>
                                <input
                                    type="password" required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                    placeholder="Min. 6 characters"
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <span>Create Account</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="verify-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOtp}
                            className="flex flex-col gap-8"
                        >
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-widest text-center">6-Digit Verification Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    autoFocus
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-6 py-5 bg-primary/5 border-2 border-primary/20 focus:bg-white rounded-3xl text-center text-2xl font-black tracking-[0.5em] focus:outline-none transition-all"
                                    placeholder="000000"
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <button
                                    type="submit"
                                    disabled={isVerifyingOtp || otp.length < 6}
                                    className="w-full py-5 bg-primary text-dark rounded-[40px] font-black text-xs uppercase tracking-widest hover:bg-dark hover:text-white transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isVerifyingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span>Verify Email</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-[10px] font-black text-gray-400 hover:text-primary uppercase tracking-widest transition-colors self-center"
                                >
                                    Didn't receive a code? Resend
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Already have an account?</span>
                    <Link to="/login" className="text-xs font-black text-dark hover:text-primary transition-colors uppercase tracking-widest">Sign In Instead</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
