import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    ShoppingBag,
    Star,
    Heart,
    Loader2,
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

import { useWishlistStore } from '../store/useWishlistStore';

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

            // Only navigate if params actually changed to avoid infinite loop
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
        <div className="min-h-screen bg-white">
            {/* Category Header */}
            <div className="bg-light/30 border-b border-gray-100 py-16 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-4">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-primary"
                    >
                        Professional Selection
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-dark tracking-tighter"
                    >
                        The Beauty Collection.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-400 font-medium max-w-lg"
                    >
                        Discover meticulously curated luxury beauty products, formulated with pure ingredients and botanical essences.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Toolbar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex items-center gap-2 p-4 bg-dark text-white rounded-2xl font-bold hover:bg-primary transition-all shadow-xl shadow-black/5"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>

                        <form onSubmit={handleSearch} className="relative flex-1 md:w-80 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search for perfection..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-base md:text-sm font-medium focus:outline-none transition-all"
                            />
                        </form>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center gap-3 bg-gray-50 px-8 py-3 rounded-full hover:bg-gray-100 transition-all group"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-dark/40 transition-colors">Sort By:</span>
                                <span className="text-sm font-bold text-dark">{SORT_OPTIONS.find(opt => opt.value === currentSort)?.label || 'Recent'}</span>
                                <motion.div
                                    animate={{ rotate: isSortOpen ? 180 : 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <ChevronDown className="w-4 h-4 text-primary" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 z-[60] overflow-hidden"
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
                                                className="w-full flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-gray-50 transition-all group"
                                            >
                                                <span className={`text-sm font-bold transition-colors ${currentSort === option.value ? 'text-primary' : 'text-dark/60 group-hover:text-dark'}`}>
                                                    {option.label}
                                                </span>
                                                {currentSort === option.value && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                    >
                                                        <Check className="w-4 h-4 text-primary" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <span className="text-xs font-black text-gray-300 uppercase tracking-widest">{products.length} Items</span>
                    </div>
                </div>

                {/* Product Grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">Summoning Beauty...</span>
                    </div>
                ) : products.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 text-center gap-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Search className="w-10 h-10" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-black text-dark">No matches found.</h3>
                            <p className="text-gray-400 font-medium max-w-xs">We couldn't find any products matching your current criteria. Try adjusting your filters.</p>
                        </div>
                        <button
                            onClick={() => { setSearch(''); navigate('/shop'); }}
                            className="text-primary font-black uppercase text-xs tracking-widest border-b-2 border-primary"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10"
                    >
                        <AnimatePresence>
                            {products.map((product, idx) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group flex flex-col gap-5"
                                >
                                    <Link to={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden rounded-[40px] shadow-sm hover:shadow-2xl transition-all duration-500">
                                        {product.imageUrl ? (
                                            <img
                                                src={resolveImageUrl(product.imageUrl)}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-light flex items-center justify-center text-gray-200">
                                                <ShoppingBag className="w-12 h-12" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 md:top-6 right-4 md:right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 scale-90 group-hover:scale-100 transition-all duration-300">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!isAuthenticated) {
                                                        navigate('/login');
                                                        return;
                                                    }
                                                    toggleItem(product);
                                                }}
                                                className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${isInWishlist(product.id) ? 'bg-primary text-white' : 'bg-white text-dark hover:text-primary'
                                                    }`}
                                            >
                                                <Heart className={`w-3.5 h-3.5 md:w-4 h-4 ${isInWishlist(product.id) ? 'fill-white' : ''}`} />
                                            </button>
                                        </div>

                                        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (!isAuthenticated) {
                                                        navigate(`/login?redirect=add-to-cart&productId=${product.id}`);
                                                        return;
                                                    }
                                                    addItem(product);
                                                }}
                                                disabled={product.stock === 0}
                                                className={`w-full py-3 md:py-4 bg-white/90 backdrop-blur-md text-dark rounded-2xl md:rounded-3xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl transition-all ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'}`}
                                            >
                                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                            </button>
                                        </div>
                                    </Link>

                                    <div className="flex flex-col gap-1 px-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{product.category?.name}</span>
                                            <div className="flex items-center gap-1 text-xs font-bold text-gray-300">
                                                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                                                <span>{(product.rating || 0).toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-black text-dark tracking-tight leading-tight line-clamp-1">{product.name}</h3>
                                        <span className="font-bold text-dark/70">₹{Number(product.price).toFixed(2)}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Sidebar Filter */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-sm bg-white h-full shadow-2xl p-10 flex flex-col gap-10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-black text-dark tracking-tight">Refine Beauty.</h2>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Scientific Filtering</span>
                                </div>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-dark" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-dark shadow-sm shadow-primary/20">
                                            <Layers className="w-3 h-3" strokeWidth={3} />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40">Categories</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => {
                                                const newParams = new URLSearchParams(searchParams);
                                                newParams.delete('category');
                                                navigate(`/shop?${newParams.toString()}`);
                                            }}
                                            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${currentCategory === '' ? 'bg-dark text-white shadow-lg shadow-black/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                }`}
                                        >
                                            All Rituals
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.set('category', cat.slug);
                                                    navigate(`/shop?${newParams.toString()}`);
                                                }}
                                                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${currentCategory === cat.slug ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center text-dark shadow-sm shadow-primary/20">
                                                <IndianRupee className="w-3 h-3" strokeWidth={3} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dark/40">Price Range</span>
                                        </div>
                                        <span className="text-xs font-black text-primary">₹{priceRange}</span>
                                    </div>
                                    <div className="flex flex-col gap-4 px-2">
                                        <div className="relative h-6 flex items-center">
                                            <input
                                                type="range"
                                                min="0"
                                                max="10000"
                                                step="100"
                                                value={priceRange}
                                                onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                                className="blossom-slider cursor-pointer"
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">
                                            <span>₹0</span>
                                            <span>₹10000+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        const newParams = new URLSearchParams(searchParams);
                                        newParams.set('maxPrice', priceRange.toString());
                                        navigate(`/shop?${newParams.toString()}`);
                                        setIsSidebarOpen(false);
                                    }}
                                    className="w-full py-4 bg-dark text-white rounded-3xl font-black shadow-xl shadow-black/10 hover:bg-primary transition-all duration-300"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={() => { setSearch(''); navigate('/shop'); setIsSidebarOpen(false); }}
                                    className="w-full py-4 text-dark font-black text-xs uppercase tracking-widest hover:text-primary transition-all"
                                >
                                    Reset All
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
