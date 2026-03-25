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
import { resolveImageUrl } from '../utils/imageUtils';

const Checkout = () => {
    const { items, total, clearCart } = useCartStore();
    const { user, isAuthenticated, setAuth } = useAuthStore();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: user?.email || '',
        name: user?.name || '',
        password: '',
        houseNo: '',
        street: '',
        landmark: '',
        area: '',
        pincode: '',
        district: '',
        state: '',
        country: 'India',
        countryCode: '+91',
        phone: '',
    });

    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pincode = e.target.value.replace(/\D/g, '').slice(0, 6);
        setFormData(prev => ({ ...prev, pincode }));

        if (pincode.length === 6) {
            setIsFetchingLocation(true);
            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = await response.json();
                
                if (data[0].Status === "Success") {
                    const postOffice = data[0].PostOffice[0];
                    setFormData(prev => ({
                        ...prev,
                        area: postOffice.Name || postOffice.Block || '',
                        district: postOffice.District || '',
                        state: postOffice.State || '',
                        country: 'India'
                    }));
                }
            } catch (err) {
                console.error('Pincode lookup failed');
            } finally {
                setIsFetchingLocation(false);
            }
        }
    };

    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

    const handleContinueToPayment = async () => {
        const { name, email, password, houseNo, street, area, district, state, country, pincode, phone } = formData;
        if (!name || (!isAuthenticated && !email) || (!isAuthenticated && !password) || !houseNo || !street || !area || !district || !state || !country || !pincode || !phone) {
            setError('Please fill in all required fields.');
            return;
        }

        if (pincode.length !== 6) {
            setError('Please enter a valid 6-digit Pincode.');
            return;
        }

        const phoneRegex = /^\d{7,15}$/;
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            setError('Please enter a valid phone number (7-15 digits).');
            return;
        }

        if (!isAuthenticated) {
            setIsSubmitting(true);
            setError('');
            try {
                await api.post('/auth/checkout-login', {
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                });
                setIsOtpSent(true);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Authentication failed. Please verify your info.');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setStep(2);
            setError('');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) return;
        setIsVerifyingOtp(true);
        setError('');
        try {
            const res = await api.post('/auth/verify-otp', { email: formData.email, otp });
            const { user, token } = res.data;
            setAuth(user, token);
            setStep(2);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid or expired OTP.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        if (!formData.email) return;
        setIsVerifyingOtp(true);
        setError('');
        try {
            await api.post('/auth/resend-otp', { email: formData.email });
            setIsOtpSent(true);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to resend OTP.');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        if (!useAuthStore.getState().isAuthenticated) {
            setError('Authentication state lost. Please refresh.');
            setIsSubmitting(false);
            return;
        }

        try {
            const fullPhone = `${formData.countryCode} ${formData.phone.replace(/\D/g, '')}`;
            // Construct a fallback string address just in case, but also send granular fields
            const fullAddress = `${formData.houseNo}, ${formData.street}${formData.landmark ? `, ${formData.landmark}` : ''}, ${formData.area}, ${formData.district}, ${formData.state}, ${formData.pincode}, ${formData.country}`;
            
            const orderPayload = {
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                shippingAddress: fullAddress,
                phone: fullPhone,
                houseNo: formData.houseNo,
                street: formData.street,
                landmark: formData.landmark,
                area: formData.area,
                district: formData.district,
                state: formData.state,
                country: formData.country,
                pincode: formData.pincode,
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

                    {error && step === 1 && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-3xl flex items-start gap-4 mb-[-2rem]">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="font-bold text-red-700">Action Required</span>
                                <p className="text-sm text-red-600">{error}</p>
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
                                    {!isAuthenticated && (
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
                                    )}
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
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                           Phone Number
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={formData.countryCode}
                                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                className="w-[100px] px-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="+91">+91 (IN)</option>
                                                <option value="+1">+1 (US/CA)</option>
                                                <option value="+44">+44 (UK)</option>
                                                <option value="+61">+61 (AU)</option>
                                                <option value="+971">+971 (AE)</option>
                                                <option value="+65">+65 (SG)</option>
                                            </select>
                                            <input
                                                type="tel" required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="flex-1 px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                placeholder="(000) 000-0000"
                                            />
                                        </div>
                                    </div>
                                    {isOtpSent && (
                                        <div className="flex flex-col gap-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Enter 6-Digit OTP Sent to {formData.email}</label>
                                            <div className="flex gap-4">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="flex-1 px-6 py-4 bg-primary/5 border-2 border-primary/20 focus:bg-white rounded-3xl text-center text-lg font-black tracking-[0.5em] focus:outline-none transition-all"
                                                    placeholder="000000"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={isVerifyingOtp || otp.length < 6}
                                                    className="px-10 bg-primary text-dark rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-dark hover:text-white transition-all disabled:opacity-50"
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                                <button 
                                                    type="button" 
                                                    onClick={handleResendOtp}
                                                    className="text-[10px] font-black text-primary uppercase tracking-widest self-start ml-4 mt-1 hover:text-dark transition-colors"
                                                >
                                                    Resend Code
                                                </button>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <MapPin className="w-3 h-3" /> Detailed Address
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text" required
                                                value={formData.houseNo}
                                                onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                placeholder="House/Flat No."
                                            />
                                            <input
                                                type="text" required
                                                value={formData.street}
                                                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                                className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                placeholder="Street Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                            Landmark (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                            placeholder="Near / Behind..."
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    Pincode
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text" required
                                                        value={formData.pincode}
                                                        onChange={handlePincodeChange}
                                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                        placeholder="6-Digit Pincode"
                                                    />
                                                    {isFetchingLocation && (
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Area / Locality</label>
                                                <input
                                                    type="text" required
                                                    value={formData.area}
                                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                    placeholder="Area"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">District</label>
                                                <input
                                                    type="text" required
                                                    value={formData.district}
                                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                    placeholder="District"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">State</label>
                                                <input
                                                    type="text" required
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                    placeholder="State"
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Country</label>
                                                <input
                                                    type="text" required
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                                    placeholder="Country"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {!isAuthenticated && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Password
                                        </label>
                                        <input
                                            type="password" required={!isAuthenticated}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                            placeholder="Enter a secure password to save your order"
                                        />
                                        <span className="text-xs text-gray-400 ml-4 font-medium mt-1">If you already have an account, enter your password to login. Otherwise, we'll create one for you.</span>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleContinueToPayment}
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-300 flex items-center justify-center gap-4 disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            <span>Continue to Payment</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </>
                                    )}
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
                                                <span className="font-medium truncate max-w-[200px]">{formData.houseNo}, {formData.street}, {formData.area}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span className="font-bold">Contact:</span>
                                                <span className="font-medium">{user?.email || formData.email}</span>
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

                                {error && step === 2 && (
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
                                                <span>Place Order — ₹{total.toFixed(2)}</span>
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
                                        <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h4 className="text-sm font-black text-dark leading-tight">{item.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 capitalize">{item.quantity} units</span>
                                    </div>
                                    <span className="text-sm font-black text-dark">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-4 pt-10 border-t border-gray-200">
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                <span className="uppercase tracking-widest">Subtotal</span>
                                <span className="text-dark">₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                                <span className="uppercase tracking-widest">Shipping</span>
                                <span className="text-secondary">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-black text-dark tracking-tighter uppercase">Total</span>
                                <span className="text-3xl font-black text-dark">₹{total.toFixed(2)}</span>
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
