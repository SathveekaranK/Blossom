import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ShoppingBag, Eye, MoveRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { resolveImageUrl } from '../utils/imageUtils';
import { TextReveal, MagneticButton, sanitizeProductName } from '../components/AnimationHelpers';




// ═══ Staggered Reveal Animation Variants ═══
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } as any
    }
};

const ProductCard = ({ product, addItem }: { product: any, addItem: any }) => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    
    return (
        <motion.div
            variants={itemVariants}
            className="group relative flex flex-col gap-8"
        >
            <Link
                to={`/products/${product.slug}`}
                className="relative block aspect-[3/4] rounded-[50px] overflow-hidden bg-light transition-all duration-1000 group-hover:shadow-premium border border-primary/5 shadow-sm"
            >
                {/* Status Badge */}
                <div className="absolute top-8 left-8 z-20">
                    <div className="px-5 py-2 bg-white/90 backdrop-blur-md text-primary rounded-full border border-primary/20 shadow-sm">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em]">New Arrival</span>
                    </div>
                </div>

                <img
                    src={resolveImageUrl(product.imageUrl, product.name)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                />
                {/* Interaction Layer */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute inset-x-8 bottom-8 flex flex-col gap-3 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                    <button
                        onClick={(e) => { 
                            e.preventDefault(); 
                            if (!isAuthenticated) {
                                navigate(`/login?redirect=add-to-cart&productId=${product.id}`);
                                return;
                            }
                            addItem(product); 
                        }}
                        className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-primary-dark flex items-center justify-center gap-3 shadow-sm hover:shadow-lg"
                    >
                        <ShoppingBag className="w-4 h-4" /> Add to Collection
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); navigate(`/products/${product.slug}`); }}
                        className="w-full py-5 bg-white/95 backdrop-blur-md text-dark rounded-2xl font-bold text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-light flex items-center justify-center gap-3 border border-primary/20 shadow-sm hover:shadow-md"
                    >
                        <Eye className="w-4 h-4" /> View Details
                    </button>
                </div>
            </Link>

            <div className="flex flex-col gap-3 items-center text-center px-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">{product.category?.name?.includes('Skin') ? 'Accessories' : product.category?.name}</span>
                <Link to={`/products/${product.slug}`}>
                    <h4 className="text-2xl font-heading font-medium text-dark leading-tight hover:text-primary transition-colors line-clamp-1 italic">{sanitizeProductName(product.name)}</h4>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-primary/30" />
                    <span className="text-sm font-bold text-dark/80 tracking-widest uppercase">₹{product.price.toLocaleString()}</span>
                    <div className="h-px w-8 bg-primary/30" />
                </div>
            </div>
        </motion.div>
    );
};

const FIXED_CATEGORIES = [
    { id: 'fixed-1', name: 'Ornate Clips', imageUrl: '/hair-clip.png', slug: 'hair-clips' },
    { id: 'fixed-2', name: 'Silk Scrunchies', imageUrl: '/scrunchie.png', slug: 'scrunchies' },
    { id: 'fixed-3', name: 'Pearl Pins', imageUrl: '/hair-pin.png', slug: 'hair-pins' },
    { id: 'fixed-4', name: 'Aesthetic Bands', imageUrl: '/hair-band.png', slug: 'hair-bands' },
];

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const { addItem } = useCartStore();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        const mockProducts = [
            { id: 'h1', name: 'Vintage Pearl Clip', price: 1250, category: { name: 'Ornate Clips' }, slug: 'vintage-pearl-clip', imageUrl: 'https://images.unsplash.com/photo-1630138210383-09439c287236?q=80&w=800' },
            { id: 'h2', name: 'Silk Ribbon Scrunchie', price: 850, category: { name: 'Silk Scrunchies' }, slug: 'silk-ribbon-scrunchie', imageUrl: 'https://images.unsplash.com/photo-1582234371197-28052e0cb87e?q=80&w=800' },
            { id: 'h3', name: 'Rose Gold Pin Set', price: 1550, category: { name: 'Pearl Pins' }, slug: 'rose-gold-pin-set', imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422ff8397?q=80&w=800' },
            { id: 'h4', name: 'Minimalist Wave Band', price: 1100, category: { name: 'Aesthetic Bands' }, slug: 'minimalist-wave-band', imageUrl: 'https://images.unsplash.com/photo-1576061100363-f947963dfd59?q=80&w=800' },
            { id: 'h5', name: 'Velvet Bow Clip', price: 950, category: { name: 'Ornate Clips' }, slug: 'velvet-bow-clip', imageUrl: 'https://images.unsplash.com/photo-1630138210383-09439c287236?q=80&w=800' },
            { id: 'h6', name: 'Golden Leaf Pin', price: 1800, category: { name: 'Pearl Pins' }, slug: 'golden-leaf-pin', imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422ff8397?q=80&w=800' },
            { id: 'h7', name: 'Lavender Silk Set', price: 1350, category: { name: 'Silk Scrunchies' }, slug: 'lavender-silk-set', imageUrl: 'https://images.unsplash.com/photo-1582234371197-28052e0cb87e?q=80&w=800' },
            { id: 'h8', name: 'Crystal Hair Vine', price: 2200, category: { name: 'Aesthetic Bands' }, slug: 'crystal-hair-vine', imageUrl: 'https://images.unsplash.com/photo-1576061100363-f947963dfd59?q=80&w=800' },
        ];
        
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/products?limit=8&sort=recent');
                if (res.data.products.length === 0) {
                    setFeaturedProducts(mockProducts);
                } else {
                    setFeaturedProducts(res.data.products);
                }
            } catch (err) {
                console.error(err);
                setFeaturedProducts(mockProducts);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <div className="flex flex-col bg-light min-h-screen" ref={containerRef}>
            {/* ═══ Soft & Airy Hero Section ═══ */}
            <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-surface">
                <motion.div 
                    style={{ scale: heroScale, opacity: heroOpacity }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src="/hair-clip.png"
                        alt="IZZA Collections Aesthetic"
                        className="w-full h-full object-cover brightness-[1.05] contrast-[0.95]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-surface" />
                </motion.div>

                <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-16">
                    <div className="flex flex-col items-center gap-8">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1.2 }}
                            className="text-[10px] md:text-xs font-bold uppercase tracking-[1.2em] text-dark/30 ml-[1.2em]"
                        >
                            E S T D . 2 0 2 6 — L U X U R Y  A D O R N M E N T S
                        </motion.span>
                        
                        <div className="flex flex-col items-center mt-12">
                            <TextReveal 
                                text="IZZA" 
                                className="text-[20vw] md:text-[16vw] lg:text-[14rem] font-heading font-medium leading-[0.7] text-dark tracking-[-0.04em]" 
                            />
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                                className="text-[3vw] md:text-[1.5vw] lg:text-[0.8rem] font-bold uppercase tracking-[2em] text-primary mt-12 ml-[2em] border-y border-primary/20 py-4 px-8"
                            >
                                COLLECTIONS
                            </motion.span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 1.5 }}
                        className="max-w-3xl flex flex-col items-center gap-16"
                    >
                        <p className="text-2xl md:text-4xl font-heading text-dark/70 italic tracking-wide leading-relaxed font-light">
                            "The art of gentle styling and modern femininity."
                        </p>
                        
                        <div className="flex flex-col items-center gap-12">
                            <MagneticButton>
                                <Link
                                    to="/shop"
                                    className="group relative inline-flex items-center gap-6 px-14 py-7 bg-primary text-white rounded-full overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 shadow-premium"
                                >
                                    <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                    <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-white transition-colors duration-700">Shop the Curation</span>
                                    <MoveRight className="relative z-10 w-5 h-5 text-white transition-transform duration-700 group-hover:translate-x-3" />
                                </Link>
                            </MagneticButton>

                            {/* Animated Scroll Line */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="flex flex-col items-center gap-6 opacity-40 hover:opacity-100 transition-opacity cursor-pointer mt-8"
                                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            >
                                <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent" />
                                <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-dark [writing-mode:vertical-lr]">Discover More</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Vertical Text Branding */}
                <div className="absolute left-10 bottom-20 vertical-text hidden lg:block opacity-40 select-none">
                    <span className="text-[10px] font-bold uppercase tracking-[1em] text-primary">Aesthetic Hair Accessories</span>
                </div>
            </section>

            {/* ═══ The Art of Adornment (Philosophy) ═══ */}
            <section className="py-64 px-6 lg:px-12 bg-surface overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1 }}
                            className="text-[10px] font-bold text-primary uppercase tracking-[0.6em] mb-12 block"
                        >
                            O U R — E S S E N C E
                        </motion.span>
                        
                        <h2 className="text-5xl md:text-7xl font-heading font-medium text-dark leading-[1.1] mb-16">
                            The Essence of <br />
                            <span className="text-primary italic font-light drop-shadow-sm">Timelessness.</span>
                        </h2>
                        
                        <div className="flex flex-col gap-10 max-w-xl">
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 1.2 }}
                                className="text-xl md:text-2xl text-dark/70 leading-relaxed font-light font-heading italic"
                            >
                                Designing delicate accents for the modern woman. Our hair accessories are crafted to be the gentle highlight of your aesthetic journey.
                            </motion.p>
                            
                            <motion.div
                                initial={{ opacity: 0, scaleX: 0 }}
                                whileInView={{ opacity: 1, scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className="h-px w-full bg-gradient-to-r from-primary/40 to-transparent origin-left"
                            />
                            
                            <Link to="/shop" className="group flex items-center gap-8 mt-4">
                                <MagneticButton>
                                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white group-hover:bg-primary-dark transition-colors duration-700">
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </MagneticButton>
                                <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-dark group-hover:text-primary transition-colors duration-700">Explore Collection</span>
                            </Link>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-10 relative">
                        <motion.div 
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                            className="aspect-[3/4] rounded-[80px] overflow-hidden shadow-premium mt-24 border border-primary/5 group cursor-crosshair"
                        >
                            <motion.img 
                                whileHover={{ scale: 1.1, rotate: -2 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                src="/hair-pin.png" 
                                className="w-full h-full object-cover transition-all duration-1000" 
                            />
                        </motion.div>
                        <motion.div 
                            initial={{ y: -100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                            className="aspect-[4/5] rounded-[80px] overflow-hidden shadow-premium border border-primary/5 group cursor-crosshair"
                        >
                            <motion.img 
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                src="/scrunchie.png" 
                                className="w-full h-full object-cover transition-all duration-1000" 
                            />
                        </motion.div>

                        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[150px]" />
                    </div>
                </div>
            </section>

            {/* ═══ Seasonal Curations (New Arrivals) ═══ */}
            <section className="py-48 px-6 lg:px-12 bg-surface/50">
                <div className="container mx-auto max-w-7xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center gap-8 mb-32"
                    >
                        <span className="text-xs font-bold text-primary uppercase tracking-[0.5em]">The Recent Acquisitions</span>
                        <h2 className="text-6xl md:text-7xl font-heading font-medium text-dark tracking-tight italic">Seasonal Curations</h2>
                        <div className="w-24 h-px bg-primary/40" />
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20"
                    >
                        {featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                addItem={addItem}
                            />
                        ))}
                    </motion.div>

                    <div className="flex justify-center mt-32">
                        <button 
                            onClick={() => navigate('/shop')}
                            className="btn-secondary group"
                        >
                            Explore Full Gallery
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ Boutique Departments ═══ */}
            <section className="px-6 lg:px-12 py-48 bg-surface">
                <div className="container mx-auto max-w-[1400px]">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {FIXED_CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Link
                                    to={`/shop?category=${cat.slug}`}
                                    className="group relative aspect-[4/5] block rounded-[60px] overflow-hidden transition-all duration-1000 border border-primary/5 shadow-sm"
                                >
                                    <img src={cat.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/40 group-hover:to-primary/60 transition-all duration-1000" />
                                    
                                    <div className="absolute inset-0 p-12 flex flex-col justify-end gap-3 text-center items-center">
                                        <h3 className="text-4xl font-heading font-medium text-white tracking-tight italic transition-all duration-700 group-hover:-translate-y-2">{sanitizeProductName(cat.name)}</h3>
                                        <div className="w-0 group-hover:w-24 h-px bg-white transition-all duration-1000" />
                                        <span className="text-[10px] font-bold text-white/0 group-hover:text-white/80 uppercase tracking-[0.5em] mt-6 transition-all duration-1000 opacity-0 group-hover:opacity-100">Explore Curation</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
