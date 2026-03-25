import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Plus, Sparkles, Star, ShoppingBag, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { resolveImageUrl } from '../utils/imageUtils';


const RecentlyAddedCard = ({ product, index, addItem }: { product: any, index: number, addItem: any }) => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || window.innerWidth < 768) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group relative flex flex-col gap-8 perspective-1000"
        >
            <Link
                to={`/products/${product.slug}`}
                className="relative aspect-[4/5] rounded-[40px] md:rounded-[60px] overflow-hidden bg-gray-50 flex items-center justify-center p-6 transition-all duration-700 ease-out shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] group-hover:shadow-[0_80px_100px_-30px_rgba(0,0,0,0.12)] group-hover:bg-white"
                style={{
                    transform: `rotateY(${mousePos.x * 15}deg) rotateX(${-mousePos.y * 15}deg)`,
                    transformStyle: 'preserve-3d'
                }}
            >
                {/* Floating Background Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
                </div>

                {/* "NEW" Badge */}
                <div className="absolute top-12 left-10 z-20">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="px-4 py-1.5 bg-dark text-white rounded-full flex items-center gap-2 shadow-2xl"
                    >
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">New Arrival</span>
                    </motion.div>
                </div>

                <motion.img
                    src={resolveImageUrl(product.imageUrl)}
                    className="w-full h-full object-contain mix-blend-multiply transition-all duration-1000 group-hover:scale-110"
                    style={{ transform: 'translateZ(50px)' }}
                />

                {/* Hover Action Overlay - Revealed on interaction (hover/touch) */}
                <div className="absolute inset-x-4 md:inset-x-8 bottom-6 md:bottom-12 flex flex-col gap-2 md:gap-3 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-95 transition-all duration-700 delay-100" style={{ transform: 'translateZ(80px)' }}>
                    <button
                        onClick={(e) => { 
                            e.preventDefault(); 
                            if (!isAuthenticated) {
                                navigate(`/login?redirect=add-to-cart&productId=${product.id}`);
                                return;
                            }
                            addItem(product); 
                        }}
                        className="w-full py-4 md:py-6 bg-dark text-white rounded-[32px] md:rounded-[40px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-primary hover:text-dark transition-all duration-500 flex items-center justify-center gap-3"
                    >
                        <ShoppingBag className="w-3.5 h-3.5 md:w-4 h-4" /> <span className="hidden xs:inline">SWIFT RITUAL</span>
                    </button>
                    <div
                        className="w-full py-3 md:py-4 bg-white/80 backdrop-blur-3xl text-dark rounded-[32px] md:rounded-[40px] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl"
                    >
                        EXPLORE SOUL <Eye className="w-3 h-3" />
                    </div>
                </div>
            </Link>

            <div className="flex flex-col gap-4 px-8 text-center" style={{ transform: `translateZ(20px)` }}>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.6em] mb-2">{product.category?.name}</span>
                    <h4 className="text-3xl font-black text-dark tracking-tighter leading-none group-hover:text-primary transition-colors duration-700">{product.name}</h4>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-gray-100" />
                    <span className="text-2xl font-black text-dark/30 tracking-tight italic font-serif group-hover:text-dark/60 transition-colors duration-700">₹{product.price.toFixed(2)}</span>
                    <div className="h-px w-8 bg-gray-100" />
                </div>
            </div>
        </motion.div>
    );
};

const FIXED_CATEGORIES = [
    { id: 'fixed-1', name: 'Skin Care', _count: { products: 120 }, imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop', slug: 'skin-care' },
    { id: 'fixed-2', name: 'Body Care', _count: { products: 95 }, imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop', slug: 'body-care' },
    { id: 'fixed-3', name: 'Fragrance', _count: { products: 45 }, imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop', slug: 'fragrance' },
    { id: 'fixed-4', name: 'Best Sellers', _count: { products: 150 }, imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1972&auto=format&fit=crop', slug: 'best-sellers' },
];

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const { addItem } = useCartStore();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const [categories] = useState<any[]>(FIXED_CATEGORIES);
    const bgTextX = useTransform(scrollYProgress, [0, 1], [100, -100]);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/products?limit=5&sort=recent');
                setFeaturedProducts(res.data.products);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="flex flex-col pb-20 overflow-hidden bg-white" ref={containerRef}>
            {/* Hero Section */}
            <section className="relative w-full min-h-[100vh] flex items-center px-6 lg:px-12 pt-20 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[#FAFAFA]">
                    <motion.div
                        animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{ x: [0, -40, 0], y: [0, 60, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[120px]"
                    />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')]" />
                </div>

                <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col gap-10"
                    >
                        <div className="flex flex-col gap-2">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-3 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full w-fit shadow-sm border border-white/50"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/60">Blossom • Professional Skincare</span>
                            </motion.div>

                            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-dark leading-[0.85] tracking-tighter">
                                Purest<br />
                                <span className="text-primary italic font-serif">Essence.</span><br />
                                <span className="text-dark hover:text-secondary-dark transition-colors duration-1000">Deep Ritual.</span>
                            </h1>
                        </div>

                        <p className="text-xl text-dark/40 font-medium max-w-lg leading-relaxed font-serif italic">
                            Discover the clinical fusion of botanical mastery and luxury skincare.
                            A transformative ritual for the conscious soul.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Link
                                to="/shop"
                                className="group w-full sm:w-auto px-12 py-5 bg-dark text-white rounded-[40px] font-black text-xs uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:bg-primary transition-all duration-700 flex items-center justify-center gap-4 hover:-translate-y-1"
                            >
                                <span>Shop The Collection</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-500" />
                            </Link>

                            <Link
                                to="/about"
                                className="w-full sm:w-auto px-12 py-5 bg-white text-dark border border-gray-100 rounded-[40px] font-black text-xs uppercase tracking-widest hover:border-dark hover:bg-gray-50 transition-all duration-700 flex items-center justify-center shadow-sm"
                            >
                                <span>Our Heritage</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-12 mt-4 pt-10 border-t border-gray-100/50">
                        </div>
                    </motion.div>

                    <div className="relative hidden lg:block perspective-1000">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                            className="relative aspect-[4/5] w-full max-w-[550px] rounded-[100px] overflow-hidden shadow-[0_80px_100px_-20px_rgba(0,0,0,0.15)] group mx-auto animate-float"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop"
                                alt="High-end skincare"
                                className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000" />

                            <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[50px] shadow-2xl translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Editor's Choice</span>
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 fill-primary text-primary" />)}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-tight leading-none">Radiance Absolute</h3>
                                    <p className="text-sm font-medium text-white/60 mt-2 italic font-serif leading-tight">A poetic fusion of rare petals and clinical gold.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Recently Added Section */}
            <section className="py-60 px-6 lg:px-12 relative overflow-hidden">
                {/* Parallax Background Text */}
                <motion.div
                    style={{ x: bgTextX }}
                    className="absolute top-40 left-0 text-[40vw] md:text-[25vw] font-black text-gray-50/50 tracking-tighter select-none pointer-events-none whitespace-nowrap z-0"
                >
                    NEW ARRIVALS
                </motion.div>

                <div className="container mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-12 mb-32">
                        <div className="flex flex-col gap-8 max-w-2xl">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-px bg-primary" />
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="text-[12px] font-black text-primary uppercase tracking-[0.8em]"
                                >
                                    Fresh Formulations
                                </motion.span>
                            </div>
                            <motion.h2
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="text-7xl md:text-9xl font-black text-dark tracking-tighter leading-[0.8]"
                            >
                                Recently<br />
                                <span className="italic font-serif text-secondary-dark">Encoded.</span>
                            </motion.h2>
                        </div>
                        <Link
                            to="/shop?sort=recent"
                            className="group flex flex-col gap-2 items-end hover:text-primary transition-colors pr-4"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-dark/20 group-hover:text-primary/40 transition-colors">Visual Archive</span>
                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.4em] text-dark group-hover:text-primary transition-all duration-500">
                                View Recent <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-700" />
                            </div>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-16">
                        {featuredProducts.map((product, idx) => (
                            <RecentlyAddedCard
                                key={product.id}
                                product={product}
                                index={idx}
                                addItem={addItem}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Boutique Categories */}
            <section className="px-6 lg:px-12 pb-40">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {categories.map((cat, i) => (
                        <Link
                            key={cat.id}
                            to={`/shop?category=${cat.slug}`}
                            className={`group relative h-[450px] md:h-[600px] rounded-[60px] md:rounded-[100px] overflow-hidden flex items-end p-8 md:p-12 shadow-2xl transition-all duration-1000 md:mt-${i % 2 === 0 ? '0' : '20'}`}
                        >
                            {cat.imageUrl ? (
                                <img src={resolveImageUrl(cat.imageUrl)} className="absolute inset-0 w-full h-full object-cover transition-all duration-[2s] group-hover:scale-125" />
                            ) : (
                                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-200">
                                    <ShoppingBag className="w-20 h-20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/20 to-transparent group-hover:from-primary/90 group-hover:via-primary/20 transition-all duration-700" />

                            <div className="relative flex flex-col gap-3 translate-y-6 group-hover:translate-y-0 transition-all duration-700 ease-out">
                                <div className="w-12 h-1 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                                <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] mb-2">{(cat as any)._count?.products || 0}+ FORMULATIONS</span>
                                <h3 className="text-5xl font-black text-white tracking-tighter leading-none">{cat.name}.</h3>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                className="absolute top-12 right-12 w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-500"
                            >
                                <Plus className="w-6 h-6" />
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
