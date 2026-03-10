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
    MapPin
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const Checkout = () => {
    const { items, total, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        address: '',
        city: '',
        zip: '',
        country: 'United States',
        card: '4242 4242 4242 4242',
        exp: '12/26',
        cvv: '123'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call for order creation
            await new Promise(resolve => setTimeout(resolve, 2500));

            const orderData = {
                items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                total,
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`
            };

            console.log('Order finalized:', orderData);

            setIsSuccess(true);
            clearCart();
            setTimeout(() => navigate('/'), 4000);
        } catch (err) {
            console.error(err);
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
                        <h2 className="text-5xl font-black text-dark tracking-tighter mb-4">Transaction Confirmed.</h2>
                        <p className="text-gray-400 font-medium max-w-sm mb-12">Successful incorporate. Your ritual formulations are being prepared for transit.</p>
                        <div className="flex flex-col gap-4 w-full max-w-xs">
                            <Link to="/" className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-black/10">Return Home</Link>
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
                            <span className="text-[10px] uppercase tracking-widest">Back to Ritual</span>
                        </Link>
                        <h1 className="text-5xl font-black text-dark tracking-tighter">Finalize Selection.</h1>
                    </div>

                    {/* Steps Header */}
                    <div className="flex items-center gap-10 border-b border-gray-100 pb-10">
                        <div className={`flex items-center gap-3 transition-colors ${step === 1 ? 'text-dark' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ring-2 ${step === 1 ? 'bg-dark text-white ring-dark' : 'bg-gray-50 ring-gray-100'}`}>1</div>
                            <span className="text-xs font-black uppercase tracking-widest">Passage</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-200" />
                        <div className={`flex items-center gap-3 transition-colors ${step === 2 ? 'text-dark' : 'text-gray-300'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ring-2 ${step === 2 ? 'bg-dark text-white ring-dark' : 'bg-gray-50 ring-gray-100'}`}>2</div>
                            <span className="text-xs font-black uppercase tracking-widest">Transaction</span>
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
                                            placeholder="curator@ritual.com"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <UserIcon className="w-3 h-3" /> Full Identity
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
                                        <MapPin className="w-3 h-3" /> Delivery Passage
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
                                    <span>Continue to Transaction</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col gap-8"
                            >
                                <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col gap-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-dark flex items-center justify-center text-white">
                                                <CreditCard className="w-6 h-6" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-dark">Secure Card Transaction</span>
                                                <span className="text-[10px] font-black uppercase text-gray-300">PCI-DSS Compliant Gateway</span>
                                            </div>
                                        </div>
                                        <Lock className="w-4 h-4 text-gray-300" />
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Card Identification</label>
                                            <input
                                                type="text" required
                                                value={formData.card}
                                                className="w-full px-6 py-4 bg-white border-2 border-transparent focus:border-primary/20 rounded-2xl text-sm font-black focus:outline-none tracking-[0.2em] transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Expiration</label>
                                                <input type="text" value={formData.exp} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl text-sm font-black focus:outline-none transition-all" />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">CVV</label>
                                                <input type="password" value={formData.cvv} className="w-full px-6 py-4 bg-white border-2 border-transparent rounded-2xl text-sm font-black focus:outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        disabled={isSubmitting}
                                        className="w-full py-6 bg-dark text-white rounded-[40px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-300 flex items-center justify-center gap-4 group disabled:bg-gray-200"
                                    >
                                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                            <>
                                                <span>Authorize Selection — ${total.toFixed(2)}</span>
                                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="text-xs font-black uppercase tracking-widest text-gray-300 hover:text-dark transition-colors self-center"
                                    >
                                        Review Passage Details
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
                            <h3 className="text-2xl font-black text-dark tracking-tighter">Your Ritual.</h3>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Scientific Summary</span>
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
                                <span className="uppercase tracking-widest">Passage</span>
                                <span className="text-secondary">Complimentary</span>
                            </div>
                            <div className="flex justify-between items-center pt-4">
                                <span className="text-lg font-black text-dark tracking-tighter uppercase">Total Amount</span>
                                <span className="text-3xl font-black text-dark">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-start gap-4 p-5 bg-white rounded-3xl border border-gray-100">
                                <ShieldCheck className="w-6 h-6 text-secondary" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-dark">Luxe Passage Guarantee</span>
                                    <span className="text-[10px] font-medium text-gray-400">Every item is clinically secured and tracked globally.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-5 bg-white rounded-3xl border border-gray-100">
                                <Truck className="w-6 h-6 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-dark">Ethical Distribution</span>
                                    <span className="text-[10px] font-medium text-gray-400">Carbon-neutral transport in 100% recyclable glass.</span>
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
