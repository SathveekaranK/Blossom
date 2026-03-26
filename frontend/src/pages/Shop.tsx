import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Heart,
    X,
    ChevronDown,
    Check,
    IndianRupee,
    Layers
} from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { resolveImageUrl } from '../utils/imageUtils';
import { useWishlistStore } from '../store/useWishlistStore';
import { TextReveal, MagneticButton, SkeletonLoader, sanitizeProductName, sanitizeCategoryName } from '../components/AnimationHelpers';




interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    slug: string;
    imageUrl?: string;
    description: string;
    stock: number;
    rating?: number;
    category?: Category;
}

const SORT_OPTIONS = [
    { value: 'recent', label: 'Recently Added' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' }
];

const Shop = () => {
    const { addItem } = useCartStore();
    const { toggleItem, isInWishlist } = useWishlistStore();
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentCategory = searchParams.get('category') || '';
    const currentSort = searchParams.get('sort') || 'recent';
    const currentMaxPrice = parseInt(searchParams.get('maxPrice') || '10000');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [priceRange, setPriceRange] = useState(currentMaxPrice);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    const sortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const newParams = new URLSearchParams(searchParams);
            
            if (search) newParams.set('search', search);
            else newParams.delete('search');
            
            if (priceRange !== 10000) newParams.set('maxPrice', priceRange.toString());
            else newParams.delete('maxPrice');

            const currentSearch = searchParams.get('search') || '';
            const currentMax = searchParams.get('maxPrice') || '10000';
            
            if (currentSearch !== (search || '') || currentMax !== priceRange.toString()) {
                navigate(`/shop?${newParams.toString()}`, { replace: true });
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, priceRange]);

    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        const urlMaxPrice = parseInt(searchParams.get('maxPrice') || '10000');
        
        if (search !== urlSearch) setSearch(urlSearch);
        if (priceRange !== urlMaxPrice) setPriceRange(urlMaxPrice);
        
        fetchProducts();
    }, [searchParams]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchInitialData = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const query = searchParams.get('search') || '';
            const category = searchParams.get('category') || '';
            const sort = searchParams.get('sort') || 'recent';
            const maxPrice = searchParams.get('maxPrice') || '10000';

            let url = `/products?limit=50&sort=${sort}&maxPrice=${maxPrice}`;
            if (category) url += `&category=${category}`;
            if (query) url += `&search=${query}`;

            const res = await api.get(url);
            setProducts(res.data.products);
        } catch (err) {
            console.error('Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newParams = new URLSearchParams(searchParams);
        if (search) newParams.set('search', search);
        else newParams.delete('search');
        navigate(`/shop?${newParams.toString()}`);
    };

    return (
        <div className="min-h-screen bg-surface pt-16">
            {/* ═══ Collection Header ═══ */}
            <header className="pt-0 pb-2 px-4 lg:px-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.01] -z-10" />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-3xl md:text-5xl font-heading font-medium text-dark leading-tight mb-2 tracking-tighter">
                        <TextReveal text="Artisanal" className="text-primary italic font-light mr-3" />
                        <TextReveal text="Adornments" />
                    </h1>
                    <div className="w-16 h-px bg-primary/20 mx-auto mb-4" />
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 1.2 }}
                        className="text-sm md:text-base text-dark/70 font-heading italic max-w-xl mx-auto leading-relaxed"
                    >
                        Explore our curation of delicate hair adornments, designed to be the soft highlight of your unique aesthetic journey.
                    </motion.p>
                </motion.div>
            </header>

            <div className="max-w-7xl mx-auto px-6 py-2">
                {/* Toolbar */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
                    <div className="flex w-full lg:w-auto items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex items-center gap-2 px-5 py-3 bg-light text-dark rounded-[14px] border border-primary/10 shadow-sm hover:border-primary/15 transition-colors font-semibold text-sm shrink-0"
                        >
                            <Filter className="w-4 h-4 text-dark" />
                            <span>Filters</span>
                        </button>

                        <form onSubmit={handleSearch} className="relative flex-1 lg:w-80 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search our adornments..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-5 py-4 bg-light border border-primary/10 rounded-2xl shadow-sm focus:border-primary focus:ring-1 focus:ring-primary/5 text-dark font-body text-sm outline-none transition-all placeholder:text-muted/40"
                            />
                        </form>
                    </div>

                    <div className="flex w-full lg:w-auto items-center justify-between lg:justify-end gap-6 shrink-0">
                        <span className="text-sm font-medium text-muted">
                            {products.length} Products
                        </span>
                        
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-2 bg-light border border-primary/10 rounded-[14px] shadow-sm px-5 py-3 hover:border-primary/15 transition-colors"
                            >
                                <span className="text-sm font-medium text-muted">Sort by:</span>
                                <span className="text-sm font-semibold text-dark">{SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || 'Recent'}</span>
                                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-56 bg-light rounded-2xl shadow-xl border border-primary/10 z-50 py-2 overflow-hidden"
                                    >
                                        {SORT_OPTIONS.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.set('sort', option.value);
                                                    navigate(`/shop?${newParams.toString()}`);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-5 py-2.5 hover:bg-primary/5 transition-colors ${currentSort === option.value ? 'bg-white/5' : ''}`}
                                            >
                                                <span className={`text-sm font-medium ${currentSort === option.value ? 'text-dark font-semibold' : 'text-muted'}`}>
                                                    {option.label}
                                                </span>
                                                {currentSort === option.value && (
                                                    <Check className="w-4 h-4 text-dark" />
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* ═══ Product Grid ═══ */}
                {isLoading ? (
                    <div className="py-20">
                        <SkeletonLoader />
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-40 text-center gap-10"
                    >
                        <div className="w-40 h-40 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
                            <Search className="w-12 h-12 text-primary/10" />
                        </div>
                        <div className="flex flex-col gap-4">
                            <h3 className="text-4xl font-heading text-primary italic">No Adornments Found</h3>
                            <p className="text-lg text-primary/40 max-w-sm font-light">
                                Perhaps redefine your seeking criteria or explore our entire curation.
                            </p>
                        </div>
                        <button
                            onClick={() => { setSearch(''); navigate('/shop'); }}
                            className="px-12 py-5 bg-primary text-surface rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-primary-dark transition-all shadow-premium"
                        >
                            Explore All Creations
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6 md:gap-8 gap-y-16"
                    >
                        <AnimatePresence mode="popLayout">
                            {products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ 
                                        delay: idx * 0.05,
                                        duration: 1,
                                        ease: [0.16, 1, 0.3, 1]
                                    }}
                                    className="group flex flex-col gap-8"
                                >
                                    <div className="relative aspect-[3/4] bg-light rounded-[50px] border border-primary/5 overflow-hidden transition-all duration-1000 group-hover:shadow-premium group-hover:border-primary/20 shadow-sm">
                                        <Link to={`/products/${product.slug}`} className="absolute inset-0 z-10" />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                                        {product.imageUrl ? (
                                            <motion.img
                                                src={resolveImageUrl(product.imageUrl, product.name)}
                                                alt={product.name}
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                                className="w-full h-full object-cover transition-all duration-[1.5s]"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-primary/10 bg-primary/[0.02]">
                                                <Layers className="w-16 h-16" />
                                            </div>
                                        )}
                                        
                                        {/* Status Badge */}
                                        {idx < 2 && (
                                            <div className="absolute top-8 left-8 z-20">
                                                <motion.div 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="px-5 py-2 bg-surface/90 backdrop-blur-md text-primary rounded-full border border-secondary/20 shadow-premium"
                                                >
                                                    <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Signature Selection</span>
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* Wishlist Button */}
                                        <div className="absolute top-8 right-8 z-30">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!isAuthenticated) { navigate('/login'); return; }
                                                    toggleItem(product);
                                                }}
                                                className={`p-3.5 rounded-full backdrop-blur-xl shadow-premium border transition-all duration-700 hover:scale-110 active:scale-90 ${isInWishlist(product.id) ? 'bg-primary border-primary text-dark' : 'bg-black/60 border-primary/10 text-dark/40 hover:text-primary hover:border-primary/30'}`}
                                            >
                                                <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-dark' : ''}`} />
                                            </button>
                                        </div>

                                        {/* Quick Add Button */}
                                        <div className="absolute bottom-10 left-8 right-8 translate-y-[130%] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-1000 z-30">
                                            <MagneticButton>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (!isAuthenticated) { navigate(`/login?redirect=add-to-cart&productId=${product.id}`); return; }
                                                        addItem(product);
                                                    }}
                                                    disabled={product.stock === 0}
                                                    className={`w-full py-5 rounded-3xl font-bold text-[10px] uppercase tracking-[0.4em] shadow-premium backdrop-blur-md transition-all ${product.stock === 0 ? 'bg-light text-muted cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'}`}
                                                >
                                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Collection'}
                                                </button>
                                            </MagneticButton>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 items-center text-center px-4 transition-transform duration-700 group-hover:-translate-y-2">
                                        <motion.span 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-[10px] font-bold text-primary uppercase tracking-[0.5em]"
                                        >
                                            {sanitizeCategoryName(product.category?.name) || "Aesthetic Adornment"}
                                        </motion.span>
                                        <Link to={`/products/${product.slug}`}>
                                            <h3 className="text-2xl font-heading font-medium text-dark leading-tight hover:text-primary transition-colors line-clamp-1 italic">
                                                {sanitizeProductName(product.name)}
                                            </h3>
                                        </Link>
                                        <div className="flex items-center gap-4">
                                            <div className="h-px w-8 bg-primary/30 group-hover:w-10 transition-all duration-1000" />
                                            <span className="font-bold text-sm tracking-widest uppercase text-dark/80">₹{Number(product.price).toLocaleString()}</span>
                                            <div className="h-px w-8 bg-primary/30 group-hover:w-10 transition-all duration-1000" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Sidebar Filter Modal */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[120] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/20 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "tween", duration: 0.3, ease: "circOut" }}
                            className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-primary/10 flex items-center justify-between">
                                <h2 className="text-xl font-heading font-bold text-dark tracking-tight">Filters</h2>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-primary/10 rounded-full transition-colors text-muted hover:text-dark"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
                                {/* Categories */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-dark" />
                                        <span className="text-sm font-semibold text-dark">Category</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.delete('category');
                                                navigate(`/shop?${newParams.toString()}`);
                                            }}
                                            className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-sm font-medium border ${currentCategory === '' ? 'bg-primary/10 border-primary/20 text-dark' : 'bg-transparent border-transparent text-dark/40 hover:bg-primary/5'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${currentCategory === '' ? 'border-primary bg-primary' : 'border-dark/10'}`}>
                                                {currentCategory === '' && <div className="w-1.5 h-1.5 bg-dark rounded-full" />}
                                            </div>
                                            All Treasures
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.set('category', cat.slug);
                                                    navigate(`/shop?${newParams.toString()}`);
                                                }}
                                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all text-sm font-medium border ${currentCategory === cat.slug ? 'bg-primary/10 border-primary/20 text-dark' : 'bg-transparent border-transparent text-dark/40 hover:bg-primary/5'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${currentCategory === cat.slug ? 'border-primary bg-primary' : 'border-dark/10'}`}>
                                                    {currentCategory === cat.slug && <div className="w-1.5 h-1.5 bg-dark rounded-full" />}
                                                </div>
                                                {sanitizeCategoryName(cat.name)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-white/10" />

                                {/* Price Range */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4 text-dark" />
                                        <span className="text-sm font-semibold text-dark">Price Range</span>
                                    </div>
                                    <div className="flex flex-col gap-4 bg-primary/5 p-5 rounded-[25px] border border-primary/10">
                                        <div className="flex justify-between items-center pb-2">
                                            <span className="text-xs font-bold text-dark/40 uppercase tracking-widest">Up to</span>
                                            <span className="text-base font-bold text-dark tracking-tight">₹{priceRange}</span>
                                        </div>
                                        <div className="relative h-4 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="100"
                                                value={priceRange}
                                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-primary/20 rounded-full outline-none appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-primary/5 bg-light grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => { setSearch(''); navigate('/shop'); setIsSidebarOpen(false); }}
                                    className="py-3 px-4 border border-primary/10 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary/5 transition-colors text-dark/60"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('maxPrice', priceRange.toString());
                                        navigate(`/shop?${newParams.toString()}`);
                                        setIsSidebarOpen(false);
                                    }}
                                    className="px-6 py-3 bg-primary text-dark rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-primary-dark transition-all shadow-sm hover:shadow-md"
                                >
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Shop;
