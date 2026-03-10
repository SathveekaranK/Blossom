import { motion, AnimatePresence } from 'framer-motion';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { ShoppingBag, X, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { items, removeItem } = useWishlistStore();
    const { addItem: addToCart } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-10"
                >
                    <div className="w-32 h-32 rounded-[40px] bg-gray-50 flex items-center justify-center text-gray-200">
                        <Heart className="w-16 h-16" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl font-black text-dark tracking-tighter">Your Sanctuary is Empty.</h1>
                        <p className="text-gray-400 font-medium max-w-sm">Curate your perfect botanical ritual by adding your favorite discoveries here.</p>
                    </div>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-dark text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all duration-500 shadow-2xl shadow-black/10"
                    >
                        Go Discover <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pt-24 pb-32">
            <header className="px-6 container mx-auto mb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Your Curation</span>
                        <h1 className="text-6xl font-black text-dark tracking-tighter leading-none">The Wishlist.</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-4xl font-black text-dark/10 tracking-tighter">{items.length} {items.length === 1 ? 'Item' : 'Items'}</span>
                    </div>
                </div>
            </header>

            <section className="px-6 container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group flex flex-col p-8 bg-gray-50 rounded-[50px] relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
                        >
                            <button
                                onClick={() => removeItem(item.id)}
                                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white flex items-center justify-center text-dark/40 hover:text-red-500 transition-colors z-10 shadow-sm"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <Link to={`/products/${item.slug}`} className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-8 shadow-xl shadow-black/5 flex items-center justify-center">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>

                            <div className="flex flex-col gap-2 mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{item.category?.name || 'Skincare'}</span>
                                <h2 className="text-2xl font-black text-dark tracking-tight leading-tight">{item.name}</h2>
                                <span className="text-lg font-black text-dark/40 tracking-tighter font-serif italic">${item.price}</span>
                            </div>

                            <button
                                onClick={() => addToCart({ ...item, quantity: 1, productId: item.id })}
                                className="w-full py-5 bg-white rounded-3xl text-dark font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-dark hover:text-white transition-all duration-500 shadow-sm"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Add to Ritual</span>
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Wishlist;
