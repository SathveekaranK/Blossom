import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ShoppingBag, User, LogOut, Heart, Menu, X, Shield, Bell, Package, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

    // Notification state
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch notifications & subscription status when authenticated
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
            fetchSubscriptionStatus();
        }
    }, [isAuthenticated]);

    // Close notification dropdown on outside click
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
                    <Link to="/" className="flex items-center gap-4 group shrink-0">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-black/20 transition-all duration-500 overflow-hidden border border-white/10 ring-1 ring-white/5"
                        >
                            <img src="/izza_image.jpeg" alt="Logo" className="w-full h-full object-cover" />
                        </motion.div>
                        <div className="hidden sm:flex flex-col">
                            <span className="text-xl md:text-2xl font-black tracking-[0.2em] text-white group-hover:text-primary transition-all duration-500 uppercase leading-none">IZZA</span>
                            <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mt-1 transition-colors group-hover:text-primary/50 leading-none">Collection</span>
                        </div>
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
                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin" className="hover:text-primary transition-all hover:tracking-[0.5em] duration-500 relative py-2 overflow-hidden group text-primary">
                                Admin Dashboard
                                <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right group-hover:origin-left" />
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        {/* Admin Link - always visible for admins */}
                        {isAuthenticated && user?.role === 'ADMIN' && (
                            <Link to="/admin" className="p-2.5 hover:bg-white/5 rounded-full transition-all relative group text-primary" title="Admin Dashboard">
                                <Shield className="w-5 h-5 group-hover:scale-110 transition-transform fill-primary/10" />
                            </Link>
                        )}

                        {/* Notification Bell - only show for authenticated users */}
                        {isAuthenticated && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => {
                                        setIsNotifOpen(!isNotifOpen);
                                        if (!isNotifOpen) fetchNotifications();
                                    }}
                                    className="p-2.5 hover:bg-white/5 rounded-full transition-all relative group text-white/60"
                                >
                                    <Bell className="w-5 h-5 group-hover:text-primary group-hover:scale-110 transition-all" />
                                    {unreadCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-black ring-2 ring-dark"
                                        >
                                            {unreadCount}
                                        </motion.span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[110] overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                            <span className="text-sm font-black text-dark">Notifications</span>
                                            <div className="flex items-center gap-2">
                                                {unreadCount > 0 && (
                                                    <button onClick={handleMarkAllRead} className="text-[10px] font-bold text-primary hover:underline">Mark all read</button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Subscribe toggle */}
                                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                                            <div className="flex items-center gap-2">
                                                <BellRing className="w-4 h-4 text-primary" />
                                                <span className="text-xs font-bold text-dark">Product Alerts</span>
                                            </div>
                                            <button
                                                onClick={handleToggleSubscription}
                                                className={`relative w-11 h-6 rounded-full transition-colors ${isSubscribed ? 'bg-primary' : 'bg-gray-200'}`}
                                            >
                                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isSubscribed ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>

                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">No notifications</p>
                                                    {!isSubscribed && (
                                                        <p className="text-[10px] text-gray-400 mt-2">Subscribe to get notified about new products!</p>
                                                    )}
                                                </div>
                                            ) : (
                                                notifications.slice(0, 10).map((notif) => (
                                                    <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                <Package className="w-4 h-4 text-primary" />
                                                            </div>
                                                            <div className="flex flex-col gap-1 flex-1">
                                                                <span className="text-xs font-bold text-dark">{notif.title}</span>
                                                                <span className="text-[10px] text-gray-400 leading-relaxed">{notif.message}</span>
                                                                <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">
                                                                    {new Date(notif.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            {!notif.isRead && (
                                                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}

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

                                        {/* Dropdown */}
                                        <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[110] p-2">
                                            {user?.role === 'ADMIN' && (
                                                <Link to="/admin" className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg text-xs font-bold text-dark flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-primary" /> Admin Dashboard
                                                </Link>
                                            )}
                                            <Link to="/my-orders" className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg text-xs font-bold text-dark flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-400" /> My Orders
                                            </Link>
                                            <div className="border-t border-gray-100 my-1" />
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
                                    className="flex items-center gap-3 p-1 rounded-full hover:bg-white/5 transition-all group lg:pr-4 cursor-pointer"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/40 group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="hidden lg:flex flex-col text-left">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 leading-none mb-0.5">Guest</span>
                                        <span className="text-xs font-bold text-white leading-none tracking-tight">Sign In</span>
                                    </div>
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
            {/* Mobile Menu Overlay */}
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
                            {isAuthenticated && (
                                <Link to="/my-orders" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-primary transition-colors">My Orders</Link>
                            )}
                        </div>
                        <div className="mt-auto border-t border-white/10 pt-10">
                            {isAuthenticated && user?.role === 'ADMIN' && (
                                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-white/60 hover:text-primary font-black uppercase tracking-widest text-xl mb-6">
                                    <Shield className="w-6 h-6" /> Admin Dashboard
                                </Link>
                            )}
                            {isAuthenticated && (
                                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-red-400 font-black uppercase tracking-widest flex items-center gap-3 text-xl">
                                    <LogOut className="w-6 h-6" /> Sign Out
                                </button>
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
