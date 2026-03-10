import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Facebook, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-32 pb-12 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-dark shadow-2xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                                <span className="font-serif italic text-2xl font-black">B</span>
                            </div>
                            <span className="text-3xl font-black tracking-tighter hover:text-primary transition-colors">Blossom.</span>
                        </Link>

                        <p className="text-xl text-white/40 font-serif italic max-w-md leading-relaxed">
                            Crafting the purest botanical rituals for the conscious soul.
                            Where clinical mastery meets luxury essence.
                        </p>

                        <div className="flex items-center gap-6">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <Link
                                    key={i}
                                    to="#"
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-dark transition-all duration-500 group"
                                >
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Quick Links */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-12">
                        <div className="flex flex-col gap-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Discovery</h4>
                            <div className="flex flex-col gap-5 text-sm font-bold text-white/30">
                                <Link to="/" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Home
                                </Link>
                                <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Collection
                                </Link>
                                <Link to="/shop" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Best Sellers
                                </Link>
                                <Link to="/wishlist" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Wishlist
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Heritage</h4>
                            <div className="flex flex-col gap-5 text-sm font-bold text-white/30">
                                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Our Story
                                </Link>
                                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Ethics
                                </Link>
                                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform" />
                                    Sustainability
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3 flex flex-col gap-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Concierge</h4>
                        <div className="flex flex-col gap-6">
                            {[
                                { icon: MapPin, text: 'Rue Faubourg, Paris' },
                                { icon: Phone, text: '+33 1 23 45 67 89' },
                                { icon: Mail, text: 'essence@blossom.com' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-dark transition-all duration-500">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                        © 2026 Blossom Laboratory. All Rights Reserved.
                    </span>
                    <div className="flex items-center gap-8 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                        <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-white transition-colors">Terms of Ritual</Link>
                    </div>
                </div>
            </div>

            {/* Bottom floating logo watermark */}
            <div className="absolute -bottom-1/4 left-1/2 -translate-x-1/2 text-[30vw] font-black text-white/[0.02] tracking-tighter select-none pointer-events-none whitespace-nowrap">
                BLOSSOM
            </div>
        </footer>
    );
};

export default Footer;
