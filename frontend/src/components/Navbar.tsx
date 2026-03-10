import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ShoppingBag, User, LogOut, Heart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import CartDrawer from './CartDrawer.tsx';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuthStore();
    const { items: cartItems } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const cartCount = cartItems.length;
    const wishlistCount = wishlistItems.length;

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                    ? 'h-20 bg-dark shadow-2xl'
                    : 'h-24 bg-dark/95 backdrop-blur-md'
                    } flex flex-col justify-center px-4 lg:px-12 border-b border-white/5`}
            >
                <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto w-full">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary flex items-center justify-center text-dark shadow-lg shadow-primary/20 transition-all duration-500"
                        >
                            <span className="font-serif italic text-xl md:text-2xl font-black">B</span>
                        </motion.div>
                        <span className="hidden sm:block text-xl md:text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">Blossom.</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex flex-1 justify-center items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
                        <Link to="/" className="hover:text-primary transition-all hover:tracking-[0.5em] duration-500 relative py-2 overflow-hidden group">
                            Home
                            <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </Link>
                        <Link to="/shop" className="hover:text-primary transition-all hover:tracking-[0.5em] duration-500 relative py-2 overflow-hidden group">
                            Collection
                            <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </Link>
                        <Link to="/about" className="hover:text-primary transition-all hover:tracking-[0.5em] duration-500 relative py-2 overflow-hidden group">
                            Heritage
                            <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        <Link to="/wishlist" className="p-2.5 hover:bg-white/5 rounded-full transition-all relative group text-white/60">
                            <Heart className="w-5 h-5 group-hover:fill-primary group-hover:text-primary transition-all group-hover:scale-110" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-dark animate-pulse" />
                            )}
                        </Link>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 md:p-2.5 hover:bg-white/5 rounded-full transition-all relative group text-white/60"
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:text-primary group-hover:scale-110 transition-all" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-primary text-dark text-[8px] min-w-[16px] md:min-w-[18px] h-[16px] md:h-[18px] px-1 rounded-full flex items-center justify-center font-black shadow-lg ring-2 ring-dark"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </button>

                        <div className="h-6 w-px bg-white/10 mx-2 hidden md:block" />

                        <AnimatePresence mode="wait">
                            {isAuthenticated ? (
                                <motion.div
                                    key="auth"
                                    className="flex items-center gap-4"
                                >
                                    <div className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all group lg:pr-4 cursor-pointer relative overflow-visible">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-dark shadow-md group-hover:bg-primary-dark transition-all duration-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="hidden lg:flex flex-col text-left">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-0.5">Hello, {user?.name?.split(' ')[0]}</span>
                                            <span className="text-xs font-bold text-white leading-none tracking-tight">Account & Lists</span>
                                        </div>

                                        {/* Simple Dropdown for Logout */}
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] p-2">
                                            <Link to={user?.role === 'ADMIN' ? '/admin' : '/profile'} className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg text-xs font-bold text-dark">Dashboard</Link>
                                            <button
                                                onClick={logout}
                                                className="w-full text-left p-3 hover:bg-red-50 rounded-lg text-xs font-bold text-red-500 flex items-center gap-3"
                                            >
                                                <LogOut className="w-4 h-4" /> Log Out
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-white/5 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-dark transition-all duration-700 border border-white/10 shrink-0"
                                >
                                    <User className="w-3.5 h-3.5" />
                                    <span>Sign In</span>
                                </Link>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2.5 hover:bg-white/5 rounded-full transition-all text-white"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

            </nav>
            {/* Mobile Menu Overlay - Outside nav for absolute layering */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[150] bg-dark p-10 flex flex-col gap-10 min-h-screen"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-white">Menu.</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-white"><X className="w-8 h-8" /></button>
                        </div>
                        <div className="flex flex-col gap-6 text-2xl font-black text-white/40">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Home</Link>
                            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Collection</Link>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Heritage</Link>
                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Wishlist</Link>
                        </div>
                        <div className="mt-auto border-t border-white/10 pt-10">
                            {isAuthenticated ? (
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-400 font-black uppercase tracking-widest flex items-center gap-3 text-xl">
                                    <LogOut className="w-6 h-6" /> Sign Out
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-primary font-black uppercase tracking-widest text-xl">Sign In</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
