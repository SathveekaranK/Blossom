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
            setError('Please complete all required fields.');
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
                setError(err.response?.data?.error || 'Authentication failed. Please check credentials.');
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
            setError('You must be logged in to complete checkout.');
            setIsSubmitting(false);
            return;
        }

        try {
            const fullPhone = `${formData.countryCode} ${formData.phone.replace(/\D/g, '')}`;
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
                window.location.href = res.data.url;
            } else {
                setIsSuccess(true);
                clearCart();
                setTimeout(() => navigate('/my-orders'), 4000);
            }
        } catch (err: any) {
            const errMsg = err.response?.data?.error || 'Payment failed. Please try again.';
            setError(errMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-6 bg-gray-50">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-300">
                    <Package className="w-8 h-8" />
                </div>
                <div className="text-center flex flex-col gap-2">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">Your Cart is Empty</h2>
                    <p className="font-body text-sm text-muted">Add some items to your cart to proceed to checkout.</p>
                </div>
                <Link to="/shop" className="btn-primary mt-2">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <AnimatePresence>
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white p-10 rounded-[32px] shadow-2xl border border-gray-100 max-w-sm w-full flex flex-col items-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-heading font-bold text-dark tracking-tight mb-2">Order Confirmed</h2>
                            <p className="font-body text-sm text-muted mb-8 text-center">Thank you for your purchase. We'll send you a confirmation email shortly.</p>
                            
                            <div className="flex flex-col gap-3 w-full">
                                <Link to="/my-orders" className="btn-primary w-full">View Orders</Link>
                                <Link to="/" className="w-full py-4 text-sm font-semibold text-dark hover:bg-gray-50 rounded-2xl transition-colors">Return Home</Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Form */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <Link to="/shop" className="flex items-center gap-2 text-muted text-sm font-semibold hover:text-dark transition-colors w-fit">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Cart</span>
                        </Link>
                        <h1 className="text-4xl font-heading font-bold text-dark tracking-tight">Checkout</h1>
                    </div>

                    {error && step === 1 && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="font-semibold text-sm text-red-800">Please review</span>
                                <p className="text-sm font-body text-red-600 leading-relaxed">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Steps Header */}
                    <div className="flex items-center gap-4 bg-white p-2 rounded-full border border-gray-200">
                        <div className={`flex-1 py-3 px-6 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${step === 1 ? 'bg-dark text-white' : 'text-muted'}`}>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
                            Shipping
                        </div>
                        <div className={`flex-1 py-3 px-6 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${step === 2 ? 'bg-dark text-white' : 'text-muted'}`}>
                            <span className="w-6 h-6 rounded-full bg-dark/10 flex items-center justify-center text-xs">2</span>
                            Payment
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        {step === 1 ? (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm"
                            >
                                <h2 className="text-xl font-heading font-bold text-dark border-b border-gray-100 pb-4 mb-2">Contact Information</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {!isAuthenticated && (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-dark ml-1 flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-muted" /> Email Address
                                            </label>
                                            <input
                                                type="email" required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="input-field"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1 flex items-center gap-2">
                                            <UserIcon className="w-3.5 h-3.5 text-muted" /> Full Name
                                        </label>
                                        <input
                                            type="text" required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field"
                                            placeholder="Jane Doe"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-xs font-semibold text-dark ml-1">
                                           Phone Number
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={formData.countryCode}
                                                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                                className="w-24 px-4 py-3 bg-white border border-gray-200 rounded-2xl focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm outline-none cursor-pointer"
                                            >
                                                <option value="+91">+91</option>
                                                <option value="+1">+1</option>
                                                <option value="+44">+44</option>
                                                <option value="+61">+61</option>
                                            </select>
                                            <input
                                                type="tel" required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="input-field flex-1"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>

                                    {isOtpSent && (
                                        <div className="flex flex-col gap-4 md:col-span-2 p-5 border border-green-200 bg-green-50 rounded-2xl mt-2">
                                            <label className="text-sm font-semibold text-green-800 ml-1">Enter code sent to {formData.email}</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value)}
                                                    className="flex-1 px-4 py-3 bg-white border border-green-200 rounded-xl focus:border-green-500 text-center text-lg font-bold tracking-[0.2em] outline-none"
                                                    placeholder="000000"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleVerifyOtp}
                                                    disabled={isVerifyingOtp || otp.length < 6}
                                                    className="px-6 bg-green-600 text-white font-semibold text-sm rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                                                >
                                                    Verify
                                                </button>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={handleResendOtp}
                                                className="text-xs font-semibold text-green-700 hover:text-green-800 transition-colors self-start underline"
                                            >
                                                Resend Code
                                            </button>
                                        </div>
                                    )}

                                    {!isAuthenticated && (
                                        <div className="flex flex-col gap-2 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                                            <label className="text-xs font-semibold text-dark ml-1 flex items-center gap-2">
                                                <Lock className="w-3.5 h-3.5 text-muted" /> Create Password (Optional)
                                            </label>
                                            <input
                                                type="password" required={!isAuthenticated}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="input-field"
                                                placeholder="Create a password for faster checkout next time"
                                            />
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-xl font-heading font-bold text-dark border-b border-gray-100 pb-4 mt-4 mb-2 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-dark" /> Shipping Address
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1 flex items-center gap-2">
                                            Pincode / Zip <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text" required
                                                value={formData.pincode}
                                                onChange={handlePincodeChange}
                                                className="input-field w-full"
                                                placeholder="000000"
                                            />
                                            {isFetchingLocation && (
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1">City / District <span className="text-red-500">*</span></label>
                                        <input
                                            type="text" required
                                            value={formData.area}
                                            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            className="input-field"
                                            placeholder="Mumbai"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1">House / Flat No. <span className="text-red-500">*</span></label>
                                        <input
                                            type="text" required
                                            value={formData.houseNo}
                                            onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                                            className="input-field"
                                            placeholder="Apt 4B"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1">Street / Locality <span className="text-red-500">*</span></label>
                                        <input
                                            type="text" required
                                            value={formData.street}
                                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                            className="input-field"
                                            placeholder="Main Street"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="text-xs font-semibold text-dark ml-1">
                                            Landmark (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.landmark}
                                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                                            className="input-field"
                                            placeholder="Near Central Park"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1">State / Province <span className="text-red-500">*</span></label>
                                        <input
                                            type="text" required
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            className="input-field"
                                            placeholder="Maharashtra"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-dark ml-1">Country <span className="text-red-500">*</span></label>
                                        <input
                                            type="text" required
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="input-field"
                                            placeholder="India"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleContinueToPayment}
                                    disabled={isSubmitting}
                                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Continue to Payment
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-6"
                            >
                                <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-[32px] flex flex-col gap-8">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-dark">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-heading font-bold text-dark">Payment Details</span>
                                                <span className="text-xs font-semibold text-muted flex items-center gap-1 mt-0.5">
                                                    <Lock className="w-3 h-3 text-green-600" /> Secure transaction via Stripe
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-4">
                                                <span className="text-xs font-semibold text-muted w-20 flex-shrink-0">Ship To:</span>
                                                <span className="text-sm text-dark font-medium">{formData.houseNo}, {formData.street}, {formData.area}</span>
                                            </div>
                                            <div className="flex gap-4">
                                                <span className="text-xs font-semibold text-muted w-20 flex-shrink-0">Contact:</span>
                                                <span className="text-sm text-dark font-medium">{user?.email || formData.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs font-medium text-muted text-center leading-relaxed px-4">
                                        You will be redirected to Stripe to securely complete your purchase.
                                    </p>
                                </div>

                                {error && step === 2 && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 font-medium text-sm">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <button
                                        disabled={isSubmitting || !isAuthenticated}
                                        className="btn-primary w-full py-5 text-base flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                Pay <span className="font-bold">₹{total.toFixed(2)}</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-sm font-semibold text-muted hover:text-dark transition-colors self-center py-2"
                                    >
                                        Edit Shipping Information
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-5 relative">
                    <div className="sticky top-32 p-8 bg-white border border-gray-100 rounded-[32px] flex flex-col gap-8 shadow-md">
                        <div className="flex flex-col gap-1 border-b border-gray-100 pb-5">
                            <h3 className="text-2xl font-heading font-bold text-dark tracking-tight">Order Summary</h3>
                            <span className="text-sm font-medium text-muted">{items.length} Items</span>
                        </div>

                        <div className="flex flex-col gap-5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-16 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-2 border border-gray-100">
                                        {item.imageUrl ? (
                                            <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        ) : (
                                            <Package className="w-6 h-6 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <h4 className="text-sm font-semibold text-dark line-clamp-2 leading-tight">{item.name}</h4>
                                        <span className="text-xs text-muted font-medium">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="text-sm font-bold text-dark w-16 text-right">₹{(item.price * item.quantity).toFixed(0)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 pt-5 border-t border-gray-100">
                            <div className="flex justify-between items-center text-sm font-medium text-muted">
                                <span>Subtotal</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium text-muted">
                                <span>Shipping</span>
                                <span className="text-green-600 font-semibold">Free</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-1">
                                <span className="text-base font-bold text-dark">Total</span>
                                <span className="text-2xl font-bold text-dark">₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                                <ShieldCheck className="w-5 h-5 text-dark" />
                                <span className="font-semibold text-dark">Secure Checkout</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
                                <Truck className="w-5 h-5 text-dark" />
                                <span className="font-semibold text-dark">Free Shipping on all orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
