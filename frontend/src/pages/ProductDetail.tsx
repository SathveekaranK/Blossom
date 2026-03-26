import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
    Share2,
    X
} from 'lucide-react';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { resolveImageUrl } from '../utils/imageUtils';
import { MagneticButton, sanitizeProductName, sanitizeCategoryName } from '../components/AnimationHelpers';


interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    slug: string;
    imageUrl?: string;
    rating?: number;
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

    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate(`/login?redirect=add-to-cart&productId=${product?.id}&quantity=${quantity}`);
            return;
        }
        if (product) {
            addItem(product, quantity);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-dark" />
                <span className="text-sm font-semibold text-muted">Loading product details...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-6 bg-gray-50">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <XCircle className="w-10 h-10 text-muted" />
                </div>
                <div className="text-center flex flex-col gap-2">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">Product Not Found</h2>
                    <p className="font-body text-sm text-muted">This item is no longer available.</p>
                </div>
                <Link to="/shop" className="btn-primary mt-4">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface">
            {/* Nav controls */}
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-8 flex items-center justify-between border-b border-secondary/10">
                <Link to="/shop" className="flex items-center gap-2 text-primary/60 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-all group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                    <span>Back to Selection</span>
                </Link>

                <div className="flex items-center gap-6">
                    <button className="p-3 text-primary/60 hover:text-primary transition-colors bg-white border border-primary/10 rounded-full hover:border-primary/30 shadow-sm">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <Link
                        to="/shop"
                        className="p-3 text-primary/60 hover:text-primary transition-colors bg-white border border-primary/10 rounded-full hover:border-primary/30 shadow-sm"
                    >
                        <X className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20 pt-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                {/* Gallery */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative aspect-square md:aspect-[4/5] bg-white rounded-[60px] overflow-hidden border border-primary/5 group shadow-sm"
                >
                    {product.imageUrl ? (
                        <img
                            src={resolveImageUrl(product.imageUrl, product.name)}
                            alt={product.name}
                            className="w-full h-full object-cover p-0 transition-transform duration-[2s] group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/10">
                            <ShoppingBag className="w-16 h-16" />
                        </div>
                    )}

                    <div className="absolute top-8 left-8 flex flex-col gap-4 z-30">
                        <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-sm border border-primary/10">
                            <Star className="w-4 h-4 fill-primary text-primary" />
                            <span className="font-bold text-sm text-dark">{(product.rating || 0).toFixed(1)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Details */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-10 pt-6"
                >
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <Link 
                                to={`/shop?category=${product.category?.slug}`}
                                className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary hover:text-primary-dark transition-colors ml-1"
                            >
                                {sanitizeCategoryName(product.category?.name)}
                            </Link>
                            <h1 className="text-5xl lg:text-7xl font-heading font-medium text-dark tracking-tight leading-[1.1]">{sanitizeProductName(product.name)}</h1>
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-4xl font-bold text-dark tracking-tight">₹{product.price.toLocaleString()}</span>
                            <div className="h-8 w-px bg-primary/20" />
                            <div className={`text-[9px] font-bold uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-full ${product.stock > 0 ? 'bg-primary/10 text-primary' : 'bg-red-50 text-red-600'}`}>
                                {product.stock > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                {product.stock > 0 ? 'In Collection' : 'Unavailable'}
                            </div>
                        </div>
                    </div>

                    <div className="py-10 border-y border-secondary/10">
                        <p className="text-primary/70 font-body text-lg leading-relaxed font-light italic">
                            {product.description?.includes('skin') ? "A masterfully crafted adornment designed to elevate your aesthetic. Part of our signature collection of timeless hair accessories." : product.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-3 p-6 bg-white rounded-[35px] items-center text-center border border-primary/5 group hover:border-primary/20 transition-all duration-500 shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mt-1">Premium Adornment</span>
                        </div>
                        <div className="flex flex-col gap-3 p-6 bg-white rounded-[35px] items-center text-center border border-primary/5 group hover:border-primary/20 transition-all duration-500 shadow-sm">
                            <Truck className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mt-1">Free Delivery</span>
                        </div>
                        <div className="flex flex-col gap-3 p-6 bg-white rounded-[35px] items-center text-center border border-primary/5 group hover:border-primary/20 transition-all duration-500 shadow-sm">
                            <Leaf className="w-6 h-6 text-primary/60 group-hover:text-primary transition-colors" />
                            <span className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mt-1">Eco Conscious</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 mt-6">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="flex items-center bg-white rounded-full px-3 h-16 border border-primary/10 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-dark/40 hover:text-primary hover:bg-primary/5 transition-all"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="w-14 text-center font-bold text-lg text-dark">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-dark/40 hover:text-primary hover:bg-primary/5 transition-all"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <MagneticButton>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={isSuccess || product?.stock === 0}
                                    className={`flex-1 min-w-[240px] h-16 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] transition-all shadow-premium flex items-center justify-center gap-4 ${isSuccess ? 'bg-green-600 text-white' : product?.stock === 0 ? 'bg-gray-100 text-dark/20 cursor-not-allowed shadow-none' : 'bg-primary text-secondary hover:bg-secondary hover:text-primary'
                                        }`}
                                >
                                    {isSuccess ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Added to Collection</span>
                                        </>
                                    ) : product?.stock === 0 ? (
                                        <>
                                            <span>Out of Collection</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Add to Collection</span>
                                        </>
                                    )}
                                </button>
                            </MagneticButton>
                            
                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate('/login');
                                        return;
                                    }
                                    product && toggleItem(product);
                                }}
                                className={`w-16 h-16 rounded-full flex justify-center items-center transition-all border shadow-sm ${isInWishlist(product?.id || '') ? 'bg-secondary border-secondary text-dark' : 'bg-white border-primary/10 text-dark/40 hover:border-primary/30 hover:text-primary'
                                    }`}
                                title="Add to Wishlist"
                            >
                                <Heart className={`w-5 h-5 ${isInWishlist(product?.id || '') ? 'fill-dark' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 pt-6 opacity-40 grayscale">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 object-contain" alt="PayPal" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 object-contain" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 object-contain" alt="Mastercard" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
