import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ShieldCheck,
    Package
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUtils';

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
                <div className="fixed inset-0 z-[120] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-dark/10 backdrop-blur-[2px]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "tween", duration: 0.3, ease: "circOut" }}
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-6 md:p-8 flex items-center justify-between border-b border-primary/10 bg-light">
                            <div className="flex items-center gap-3">
                                <h2 className="text-xl font-heading font-bold text-dark tracking-tight">Shopping Cart</h2>
                                <span className="text-xs font-ui font-medium text-muted px-2 py-0.5 rounded-full bg-light">{items.length}</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-muted hover:text-dark"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 custom-scrollbar bg-white">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6 py-10">
                                    <div className="w-20 h-20 rounded-full bg-light flex items-center justify-center text-muted">
                                        <ShoppingBag className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-heading font-bold text-dark">Your cart is empty</h3>
                                        <p className="text-sm text-muted font-body">Looks like you haven't made your choice yet.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="btn-primary mt-2"
                                    >
                                        Explore Collection
                                    </button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div
                                        layout
                                        key={item.id}
                                        className="flex gap-4 group"
                                    >
                                        <div className="w-24 h-28 overflow-hidden rounded-xl bg-light flex-shrink-0 border border-primary/10 flex items-center justify-center">
                                            {item.imageUrl ? (
                                                <img src={resolveImageUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <Package className="w-6 h-6 text-muted/40" />
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-between flex-1 py-1">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-ui font-semibold text-dark text-sm leading-tight line-clamp-2">{item.name}</h4>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <span className="text-xs font-ui font-medium text-muted">₹{item.price.toFixed(2)}</span>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center bg-light rounded-xl p-1 border border-primary/20 shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-all text-muted hover:text-primary"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-ui font-bold text-dark">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-all text-muted hover:text-primary"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                <span className="font-ui font-bold text-dark">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 md:p-8 bg-light border-t border-primary/10 flex flex-col gap-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-end justify-between">
                                        <span className="text-sm font-ui font-medium text-muted">Subtotal</span>
                                        <span className="text-2xl font-heading font-bold text-dark">₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-ui font-medium text-dark bg-light px-3 py-2 rounded-lg w-fit mt-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                        <span>Secure Checkout & Payment</span>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Link
                                        to="/checkout"
                                        onClick={onClose}
                                        className="btn-primary w-full flex items-center justify-center gap-2 group"
                                    >
                                        <span>Proceed to Checkout</span>
                                    </Link>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2 text-muted font-ui font-semibold text-xs hover:text-dark transition-colors"
                                    >
                                        Continue Shopping
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
