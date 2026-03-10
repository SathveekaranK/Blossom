import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    ShieldCheck,
    Package
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
    const { items, removeItem, updateQuantity } = useCartStore();

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-dark/60 backdrop-blur-md"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white relative z-10">
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black text-dark tracking-tighter">Your Ritual.</h2>
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{items.length} Items Selected</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5 text-dark" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-20">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                                        <ShoppingBag className="w-10 h-10" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-xl font-black text-dark">Empty Vessal.</h3>
                                        <p className="text-gray-400 font-medium max-w-[200px]">Your collection is currently empty. Begin your beauty routine now.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-4 bg-dark text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-primary transition-all"
                                    >
                                        Explore Collection
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-5 group"
                                    >
                                        <div className="w-24 h-32 rounded-3xl overflow-hidden bg-light flex-shrink-0 shadow-sm">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                    <Package className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-between flex-1 py-1">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="font-black text-dark text-sm tracking-tight leading-tight line-clamp-1">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">${item.price.toFixed(2)}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center bg-gray-50 p-1 rounded-full border border-gray-100">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-full transition-all"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-full transition-all"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="font-black text-dark text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Subtotal</span>
                                        <span className="font-black text-dark text-lg">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-secondary bg-secondary/10 px-4 py-2 rounded-xl w-fit">
                                        <ShieldCheck className="w-3 h-3" />
                                        <span>Complimentary carbon-neutral shipping</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        to="/checkout"
                                        onClick={onClose}
                                        className="w-full py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-300 flex items-center justify-center gap-4 group"
                                    >
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-4 text-dark font-black text-[10px] uppercase tracking-widest hover:text-primary transition-all"
                                    >
                                        Continue Browsing
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
