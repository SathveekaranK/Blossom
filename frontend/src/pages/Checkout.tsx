import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Truck,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    Loader2,
    ChevronRight,
    Package,
    Lock,
    Mail,
    User as UserIcon,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/api';

const Checkout = () => {
    const { items, total, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        address: '',
        city: '',
        zip: '',
        country: 'United States',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!isAuthenticated) {
            setError('Please log in to complete your purchase.');
            setIsSubmitting(false);
            return;
        }

        try {
            const orderPayload = {
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`,
            };

            const res = await api.post('/orders/checkout', orderPayload);

            if (res.data.mode === 'stripe' && res.data.url) {
                // Redirect to Stripe
                window.location.href = res.data.url;
            } else {
                // Simulated payment — success
                setIsSuccess(true);
                clearCart();
                setTimeout(() => navigate('/my-orders'), 4000);
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.error || 'Checkout failed. Please try again.';
            setError(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-6">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                    <Package className="w-10 h-10" />
                </div>
                <h2 className="text-4xl font-black text-dark tracking-tighter">Empty Ritual.</h2>
                <p className="text-gray-400 font-medium max-w-xs text-center">Your collection is empty. Return to the shop to begin your journey.</p>
                <Link to="/shop" className="px-10 py-4 bg-dark text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-primary transition-all">
                    Explore Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="w-32 h-32 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-8"
                        >
                            <CheckCircle2 className="w-16 h-16" />
                        </motion.div>
                        <h2 className="text-5xl font-black text-dark tracking-tighter mb-4">Order Confirmed!</h2>
                        <p className="text-gray-400 font-medium max-w-sm mb-12">Your order has been placed successfully. You can track it in your order history.</p>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <Link to="/my-orders" className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 text-center">View My Orders</Link>
                            <Link to="/" className="w-full py-5 bg-gray-50 text-dark rounded-[40px] font-black text-xs uppercase tracking-widest text-center">Return Home</Link>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Auto-redirecting in 4s</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Main Form */}
                <div className="lg:col-span-7 flex flex-col gap-16">
                    <div className="flex flex-col gap-4">
                        <Link to="/shop" className="flex items-center gap-2 text-dark font-black hover:text-primary transition-colors w-fit">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-[10px] uppercase tracking-widest">Back to Collection</span>
                        </Link>
                        <h1 className="text-5xl font-black text-dark tracking-tighter">Checkout.</h1>
                    </div>

                    {!isAuthenticated && (
                        <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-2">
                                <span className="font-bold text-dark">Login Required</span>
                                <p className="text-sm text-gray-500">You need to <Link to="/login" className="text-primary font-bold hover:underline">sign in</Link> to complete your purchase.</p>
                            </div>
                        </div>
                    )}

                    {/* Steps Header */}
                    <div className="flex items-center gap-10 border-b border-gray-100 pb-10">
                        <div className={`flex items-center gap-3 transition-colors ${step === 1 ? 'text-dark' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ring-2 ${step === 1 ? 'bg-dark text-white ring-dark' : 'bg-gray-50 ring-gray-100'}`}>1</div>
                            <span className="text-xs font-black uppercase tracking-widest">Shipping</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-200" />
                        <div className={`flex items-center gap-3 transition-colors ${step === 2 ? 'text-dark' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ring-2 ${step === 2 ? 'bg-dark text-white ring-dark' : 'bg-gray-50 ring-gray-100'}`}>2</div>
                            <span className="text-xs font-black uppercase tracking-widest">Confirm & Pay</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                        {step === 1 ? (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
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
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <UserIcon className="w-3 h-3" /> Full Name
                                        </label>
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <MapPin className="w-3 h-3" /> Shipping Address
                                    </label>
                                    <input
                                        type="text" required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all mb-4"
                                        placeholder="Street Address"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text" required
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                            placeholder="City"
                                        />
                                        <input
                                            type="text" required
                                            value={formData.zip}
                                            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                            placeholder="Zip Code"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-300 flex items-center justify-center gap-4"
                                >
                                    <span>Continue to Payment</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-8"
                            >
                                <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-dark flex items-center justify-center text-white">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-dark">Secure Payment</span>
                                                <span className="text-[10px] font-black uppercase text-gray-300">Processed securely via Stripe</span>
                                            </div>
                                        </div>
                                        <Lock className="w-4 h-4 text-gray-300" />
                                    </div>

                                    <div className="p-6 bg-white rounded-3xl border border-gray-100">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className="font-bold">Shipping to:</span>
                                                <span className="font-medium">{formData.address}, {formData.city}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className="font-bold">Contact:</span>
                                                <span className="font-medium">{formData.email}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className="font-bold">Items:</span>
                                                <span className="font-medium">{items.length} products</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                                        Payment will be processed securely. Your card information is never stored on our servers.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-xs font-bold">{error}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <button
                                        disabled={isSubmitting || !isAuthenticated}
                                        className="w-full py-6 bg-dark text-white rounded-[40px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-300 flex items-center justify-center gap-4 group disabled:bg-gray-200 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <span>Place Order — ${total.toFixed(2)}</span>
                                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs font-black uppercase tracking-widest text-gray-300 hover:text-dark transition-colors self-center"
                                    >
                                        Edit Shipping Details
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-32 p-10 bg-gray-50 rounded-[60px] border border-gray-100 flex flex-col gap-10">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-2xl font-black text-dark tracking-tighter">Order Summary.</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Review your items</span>
                        </div>

                        <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-5">
                                    <div className="w-16 h-20 rounded-2xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="text-sm font-black text-dark leading-tight">{item.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 capitalize">{item.quantity} units</span>
                                    </div>
                                    <span className="text-sm font-black text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 pt-10 border-t border-gray-200">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                <span className="uppercase tracking-widest">Subtotal</span>
                                <span className="text-dark">${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                <span className="uppercase tracking-widest">Shipping</span>
                                <span className="text-secondary">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-black text-dark tracking-tighter uppercase">Total</span>
                                <span className="text-3xl font-black text-dark">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4 p-5 bg-white rounded-3xl border border-gray-100">
                                <ShieldCheck className="w-6 h-6 text-secondary" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-dark">Secure Checkout</span>
                                    <span className="text-[10px] font-medium text-gray-400">SSL encrypted. Your data is protected.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-5 bg-white rounded-3xl border border-gray-100">
                                <Truck className="w-6 h-6 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-dark">Free Shipping</span>
                                    <span className="text-[10px] font-medium text-gray-400">Complimentary delivery on all orders.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
