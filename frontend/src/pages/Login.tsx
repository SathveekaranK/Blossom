import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import api from '../api/api';

const Login = () => {
    const { setAuth, isAuthenticated } = useAuthStore();
    const { addItem } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Redirect if already authenticated
    if (isAuthenticated) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            const res = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            });
            
            const { user, token } = res.data;
            setAuth(user, token);
            await useCartStore.getState().fetchCartFromDB();

            // Handle post-login redirect for cart
            const redirectParams = new URLSearchParams(location.search);
            const redirect = redirectParams.get('redirect');
            const productId = redirectParams.get('productId');
            const quantity = parseInt(redirectParams.get('quantity') || '1');

            if (redirect === 'add-to-cart' && productId) {
                try {
                    const prodRes = await api.get(`/products/id/${productId}`);
                    addItem(prodRes.data, quantity);
                    navigate('/shop', { replace: true });
                } catch (e) {
                    console.error('Failed to auto-add to cart after login', e);
                    navigate('/shop', { replace: true });
                }
            } else {
                const from = (location.state as any)?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
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
                    <Link to="/" className="w-12 h-12 rounded-2xl bg-dark text-white flex items-center justify-center hover:bg-primary transition-all duration-500 shadow-xl shadow-black/10">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-4xl font-black text-dark tracking-tighter text-center">
                            Welcome Back.
                        </h1>
                        <p className="text-gray-400 font-medium text-center">
                            Access your professional skincare account
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

                <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6"
                >
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
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                <span>Sign In</span>
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </motion.form>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium">Don't have an account?</span>
                    <Link to="/register" className="text-xs font-black text-dark hover:text-primary transition-colors uppercase tracking-widest">Create One Now</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
