import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShoppingBag,
    Star,
    Heart,
    Loader2,
    ChevronLeft,
    Plus,
    Minus,
    ShieldCheck,
    Truck,
    Leaf,
    CheckCircle2,
    XCircle,
    Share2
} from 'lucide-react';
import api from '../api/api';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    slug: string;
    imageUrl?: string;
    category?: { name: string; slug: string; };
}

const ProductDetail = () => {
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const { slug } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [slug]);

    const fetchProduct = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/products/${slug}`);
            setProduct(res.data);
        } catch (err) {
            console.error('Failed to fetch product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">Essence Loading...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-6">
                <h2 className="text-4xl font-black text-dark">Not found.</h2>
                <Link to="/shop" className="px-8 py-3 bg-dark text-white rounded-2xl font-black shadow-xl shadow-black/10 hover:bg-primary transition-all">
                    Back to Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs & Exit */}
            <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between relative">
                <Link to="/shop" className="flex items-center gap-2 text-dark font-black hover:text-primary transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest">Collection</span>
                </Link>

                <div className="flex items-center gap-4">
                    <button className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <Share2 className="w-4 h-4 text-dark" />
                    </button>
                    <Link
                        to="/shop"
                        className="p-3 bg-dark text-white rounded-full hover:bg-primary transition-all shadow-xl shadow-black/10 hover:rotate-90 group"
                        title="Exit Ritual"
                    >
                        <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
                {/* Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl group"
                >
                    {product.imageUrl ? (
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-light flex items-center justify-center text-gray-200">
                            <ShoppingBag className="w-24 h-24" />
                        </div>
                    )}

                    <div className="absolute top-10 left-10 flex flex-col gap-3">
                        <div className="bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                            <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                            <span className="font-black text-sm text-dark">4.9/5</span>
                        </div>
                        <div className="bg-primary text-white px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                            <Leaf className="w-4 h-4" />
                            <span className="font-black text-[10px] uppercase tracking-widest">Natural Essence</span>
                        </div>
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-10"
                >
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{product.category?.name}</span>
                        </div>
                        <h1 className="text-5xl font-black text-dark tracking-tight leading-tight">{product.name}.</h1>
                        <div className="flex items-center gap-6">
                            <span className="text-3xl font-black text-dark/70">${Number(product.price).toFixed(2)}</span>
                            <div className="h-4 w-px bg-gray-200" />
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 ${product.stock > 0 ? 'text-secondary' : 'text-red-500'}`}>
                                {product.stock > 0 ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {product.stock > 0 ? 'Batch Available' : 'Waitlist Active'}
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                        {product.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                            <ShieldCheck className="w-6 h-6 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-dark/40">Pure Promise</span>
                            <span className="text-xs font-bold text-dark">Clinically Tested</span>
                        </div>
                        <div className="flex flex-col gap-2 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                            <Truck className="w-6 h-6 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-dark/40">Swift Passage</span>
                            <span className="text-xs font-bold text-dark">Luxe Delivery</span>
                        </div>
                        <div className="flex flex-col gap-2 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
                            <Leaf className="w-6 h-6 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-dark/40">Ethical Soul</span>
                            <span className="text-xs font-bold text-dark">Vegan Formulated</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 mt-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center bg-gray-100/50 p-2 rounded-full border border-gray-100">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-md rounded-full transition-all"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-white hover:shadow-md rounded-full transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={() => product && toggleItem(product)}
                                className={`p-5 border-2 rounded-full transition-all transform hover:scale-105 active:scale-95 group ${isInWishlist(product?.id || '') ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-gray-100 text-dark hover:border-dark'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 transition-all ${isInWishlist(product?.id || '') ? 'fill-white' : 'group-hover:fill-dark'}`} />
                            </button>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="group relative w-full py-5 bg-dark text-white rounded-[40px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-black/10 hover:bg-primary transition-all duration-300 flex items-center justify-center gap-4 overflow-hidden disabled:bg-gray-200 disabled:shadow-none"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            {isSuccess ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                                    <span>Essence Added.</span>
                                </motion.div>
                            ) : (
                                <>
                                    <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Incorporate into Routine — ${(product.price * quantity).toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex items-center gap-8 pt-6 border-t border-gray-50 opacity-40">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
