import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ShoppingBag, LogOut, Heart, Menu, X, Shield, Bell, BellRing } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import CartDrawer from './CartDrawer.tsx';
import api from '../api/api';

const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuthStore();
    const { items: cartItems } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            fetchSubscriptionStatus();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/subscriptions/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (err) { /* ignore */ }
    };

    const fetchSubscriptionStatus = async () => {
        try {
            const res = await api.get('/subscriptions/status');
            setIsSubscribed(res.data.isSubscribed);
        } catch (err) { /* ignore */ }
    };

    const handleToggleSubscription = async () => {
        try {
            const res = await api.post('/subscriptions/toggle');
            setIsSubscribed(res.data.isSubscribed);
        } catch (err) { /* ignore */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/subscriptions/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) { /* ignore */ }
    };

    const cartCount = cartItems.length;
    const wishlistCount = wishlistItems.length;

    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
                    isScrolled ? 'py-4 glass border-b border-gray-100' : 'py-8 bg-transparent'
                }`}
            >
                {/* Scroll Progress Indicator */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-secondary z-[110] origin-left"
                    style={{ scaleX }}
                />

                <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto w-full px-4 md:px-10 lg:px-16">
                        
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-4 group shrink-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-primary/40 group-hover:border-primary transition-all duration-300 bg-secondary">
                            <img 
                                src="/izza_image.jpeg" 
                                alt="Izza Collections" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="hidden sm:flex flex-col justify-center">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl md:text-2xl font-heading font-medium tracking-tight text-dark transition-colors duration-300 leading-none">IZZA</span>
                                <span className="text-[10px] font-bold tracking-[0.1em] text-primary uppercase mt-0.5 leading-none">Collections</span>
                            </div>
                            <span className="text-[8px] font-medium tracking-[0.3em] text-muted uppercase mt-1 leading-none">Aesthetic Adornments</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex flex-1 justify-center items-center gap-10 text-[10px] font-ui font-bold uppercase tracking-[0.3em] text-dark/60">
                        <Link to="/" className="hover:text-primary transition-colors duration-300 relative py-2 group">
                            Home
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                        <Link to="/shop" className="hover:text-primary transition-colors duration-300 relative py-2 group">
                            The Shop
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                        <Link to="/about" className="hover:text-primary transition-colors duration-300 relative py-2 group">
                            Our Story
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 text-dark/70">
                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group hidden sm:block" title="Admin Dashboard">
                                <Shield className="w-5 h-5 text-primary group-hover:text-secondary group-hover:scale-105 transition-all" />
                            </Link>
                        )}

                        {isAuthenticated && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => {
                                        setIsNotifOpen(!isNotifOpen);
                                        if (!isNotifOpen) fetchNotifications();
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group"
                                >
                                    <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full" />
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotifOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[110]"
                                        >
                                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                                <span className="font-bold text-xs uppercase tracking-widest text-dark">Notifications</span>
                                                <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-secondary uppercase hover:text-dark transition-colors">Mark all read</button>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                                {notifications.length > 0 ? (
                                                    notifications.map((notif: any) => (
                                                        <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.isRead ? 'bg-secondary/5' : ''}`}>
                                                            <p className="text-sm font-medium text-dark leading-tight">{notif.message}</p>
                                                            <span className="text-[10px] text-muted mt-2 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-10 text-center text-muted text-sm font-medium italic">No new styling adornments found.</div>
                                                )}
                                            </div>
                                            <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                                                <button onClick={handleToggleSubscription} className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-dark/70 hover:text-dark">
                                                    {isSubscribed ? <BellRing className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                                                    {isSubscribed ? 'Disable Updates' : 'Notify me of New Drops'}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group" title="Wishlist">
                            <Heart className="w-5 h-5 group-hover:text-accent transition-colors" />
                            {wishlistCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full" />
                            )}
                        </Link>

                        <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-gray-100 rounded-full transition-colors relative group" title="Shopping Bag">
                            <ShoppingBag className="w-5 h-5 group-hover:text-dark transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary border-2 border-white rounded-full" />
                            )}
                        </button>

                        <div className="hidden sm:flex items-center gap-4 border-l border-gray-100 pl-6 ml-2">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/profile" className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-dark font-heading font-bold text-lg group-hover:bg-dark group-hover:text-white transition-all duration-300">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    </Link>
                                    <button onClick={logout} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-full transition-all duration-300" title="Sign Out">
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="px-8 py-3 bg-primary text-dark rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary-dark transition-all shadow-sm hover:shadow-md">
                                    Sign In
                                </Link>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors text-dark"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-white pt-24 px-8 pb-10 flex flex-col gap-8 min-h-screen"
                    >
                        <div className="flex flex-col gap-6 text-2xl font-heading font-semibold text-dark">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Home</Link>
                            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Collection</Link>
                            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Heritage</Link>
                            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">Wishlist</Link>
                            {isAuthenticated && (
                                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">My Orders</Link>
                            )}
                        </div>
                        <div className="mt-auto border-t border-gray-100 pt-8 flex flex-col gap-6">
                            {isAuthenticated && user?.role === 'ADMIN' && (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-dark hover:text-primary font-ui font-semibold text-lg">
                                    <Shield className="w-5 h-5" /> Admin Dashboard
                                </Link>
                            )}
                            {isAuthenticated ? (
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-accent font-ui font-semibold flex items-center gap-3 text-lg">
                                    <LogOut className="w-5 h-5" /> Sign Out
                                </button>
                            ) : (
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full text-center">
                                    Sign In / Register
                                </Link>
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
