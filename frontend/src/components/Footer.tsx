import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-32 pb-12 overflow-hidden relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
                    {/* Brand Section */}
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-black/20 transition-all duration-500 overflow-hidden border border-white/10 ring-1 ring-white/5">
                                <img src="/izza_image.jpeg" alt="Logo" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-black tracking-[0.2em] text-white group-hover:text-primary transition-all duration-500 uppercase leading-none">IZZA</span>
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mt-1 transition-colors group-hover:text-primary/50 leading-none">Collection</span>
                            </div>
                        </Link>
                       

                        <p className="text-xl text-white/40 font-serif italic max-w-md leading-relaxed">
                            Crafting the purest botanical rituals for the conscious soul.
                            Where clinical mastery meets luxury essence.
                        </p>

                        <div className="flex items-center gap-6">
                            {[Instagram].map((Icon, i) => (
                                <Link
                                    key={i}
                                    to="https://www.instagram.com/reels/DJbdZo9z1mh/"
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-dark transition-all duration-500 group"
                                >
                                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </Link>
                                
                            ))}
                             <a href="https://www.instagram.com/reels/DJbdZo9z1mh/">izza collection</a>
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
                                { icon: MapPin, text: 'Global Headquarters' },
                                { icon: Phone, text: 'Contact via Support' },
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
                        © {new Date().getFullYear()} Blossom Laboratory. All Rights Reserved.
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
