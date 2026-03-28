import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-surface text-dark pt-24 pb-10 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 flex flex-col gap-8 text-center md:text-left">
                        <Link to="/" className="flex items-center md:items-start flex-col gap-4 hover:opacity-80 transition-opacity mx-auto md:mx-0 w-fit">
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-primary/20 shadow-sm bg-light">
                                <img 
                                    src="/izza_image.jpeg" 
                                    alt="Izza Collections" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-heading font-medium tracking-tight text-dark leading-none">IZZA</span>
                                <span className="text-[10px] font-bold tracking-[0.1em] text-primary uppercase mt-1 leading-none">Collections</span>
                            </div>
                        </Link>
                       
                        <p className="text-sm text-dark/60 font-body max-w-sm leading-relaxed mx-auto md:mx-0">
                            A curated selection of modern hair adornments designed for the aesthetic woman. Elevating your daily ritual with soft, feminine elegance.
                        </p>

                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-light flex items-center justify-center text-primary hover:bg-primary hover:text-dark transition-all duration-300 shadow-sm">
                                <Instagram className="w-4 h-4" />
                            </a>
                           <a href='https://www.instagram.com/izza_collections2129?utm_source=qr&igsh=MW5jbTdya2FiY2dpYg%3D%3D' className="text-xs font-bold text-dark/70 hover:text-primary transition-colors tracking-widest uppercase">izza_collections2129
</a>
                        </div>
                    </div>

                    {/* Navigation Quick Links */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Explore</h4>
                            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-dark/50">
                                <a href="#" className="hover:text-primary transition-colors w-fit">Home</a>
                                <Link to="/shop" className="hover:text-primary transition-colors w-fit">The Shop</Link>
                                <Link to="/about" className="hover:text-primary transition-colors w-fit">Our Story</Link>
                                <Link to="/wishlist" className="hover:text-primary transition-colors w-fit">Wishlist</Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Services</h4>
                            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest text-dark/50">
                                <Link to="/my-orders" className="hover:text-primary transition-colors w-fit">My Orders</Link>
                                <Link to="#" className="hover:text-primary transition-colors w-fit">Shipping & Returns</Link>
                                <Link to="#" className="hover:text-primary transition-colors w-fit">Gifting Collections</Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-4 flex flex-col gap-6 text-center md:text-left">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Contact Us</h4>
                        <div className="flex flex-col gap-5 text-[10px] font-bold uppercase tracking-widest text-dark/50 mx-auto md:mx-0 w-fit">
                            <div className="flex items-start gap-4">
                                <MapPin className="w-5 h-5 shrink-0 text-primary/40" />
                                <span className="leading-relaxed">
                                    Minimalist Boutique Bldg.<br />
                                    Aesthetic District, NY 10001
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="w-5 h-5 shrink-0 text-primary/40" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="w-5 h-5 shrink-0 text-primary/40" />
                                <span>izzacollections2129@gmail.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-bold text-dark/30 uppercase tracking-[0.3em]">
                        © {new Date().getFullYear()} IZZA COLLECTIONS. All Rights Reserved.
                    </span>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-dark/30 uppercase tracking-[0.3em]">
                        <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
