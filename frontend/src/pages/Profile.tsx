import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { User, Mail, Shield, LogOut, ShoppingBag, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuthStore();

    if (!user) return null;

    const stats = [
        { label: 'View Orders', icon: ShoppingBag, link: '/my-orders', color: 'text-secondary' },
        { label: 'My Wishlist', icon: Heart, link: '/wishlist', color: 'text-accent' },
    ];

    return (
        <div className="min-h-screen bg-light pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-8 md:p-12 shadow-luxury border border-gray-100 mb-8 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-32 h-32 rounded-full bg-dark flex items-center justify-center text-white text-4xl font-heading font-bold shadow-2xl border-4 border-white"
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </motion.div>
                        
                        <div className="text-center md:text-left flex-1">
                            <motion.h1 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-5xl font-heading font-bold text-dark mb-2"
                            >
                                {user.name}
                            </motion.h1>
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-wrap justify-center md:justify-start gap-4 text-muted font-ui font-medium"
                            >
                                <span className="flex items-center gap-2 bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
                                    <Mail className="w-4 h-4" /> {user.email}
                                </span>
                                <span className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full border border-secondary/20">
                                    <Shield className="w-4 h-4" /> {user.role}
                                </span>
                            </motion.div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </motion.button>
                    </div>
                </motion.div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                        >
                            <Link 
                                to={item.link}
                                className="group block bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-luxury transition-all duration-500 relative overflow-hidden h-full"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-dark group-hover:text-white transition-all duration-500 ${item.color}`}>
                                    <item.icon className="w-6 h-6 transition-transform duration-500 group-hover:scale-110" />
                                </div>
                                <h3 className="text-xl font-heading font-bold text-dark mb-2">{item.label}</h3>
                                <p className="text-muted text-sm font-ui mb-4">Manage your {item.label.toLowerCase()} settings and history.</p>
                                <div className="flex items-center gap-2 text-dark font-bold text-[10px] uppercase tracking-widest">
                                    Go to section
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >→</motion.span>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Branding Accent */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ delay: 1 }}
                    className="mt-20 text-center"
                >
                    <span className="text-6xl md:text-8xl font-heading font-black text-gray-200 uppercase tracking-[0.5em] select-none pointer-events-none">
                        IZZA
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
