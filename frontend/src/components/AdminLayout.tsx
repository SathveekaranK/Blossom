import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Layers,
    ShoppingCart,
    Users,
    Settings,
    ArrowLeft,
    Search,
    BarChart3,
    Menu,
    X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const AdminLayout = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Products', icon: Package, path: '/admin/products' },
        { name: 'Analysis', icon: BarChart3, path: '/admin/analysis' },
        { name: 'Categories', icon: Layers, path: '/admin/categories' },
        { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
        { name: 'Users', icon: Users, path: '/admin/users' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50" style={{ scrollbarGutter: 'stable' }}>
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-dark/20 backdrop-blur-sm z-50 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 flex flex-col p-6 gap-8 z-[60] transition-transform duration-300 lg:translate-x-0 overflow-y-auto custom-scrollbar ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between lg:block shrink-0">
                    <Link to="/" className="flex items-center gap-3 px-2 group">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl text-dark border border-gray-100 flex items-center justify-center group-hover:bg-gray-100 transition-all duration-300">
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="font-heading font-bold text-xl text-dark tracking-tight">Main Site</span>
                    </Link>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors border border-gray-200"
                    >
                        <CloseIcon className="w-5 h-5 text-muted" />
                    </button>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted px-4 mb-2">Management</span>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${location.pathname === item.path
                                    ? 'bg-dark text-white shadow-md'
                                    : 'text-muted hover:bg-gray-50 hover:text-dark'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2 shrink-0">
                    <Link
                        to="/admin/settings"
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${location.pathname === '/admin/settings'
                                ? 'bg-dark text-white shadow-md'
                                : 'text-muted hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0 overflow-hidden">
                <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 w-full">
                    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 shrink-0">
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                            >
                                <Menu className="w-5 h-5 text-dark" />
                            </button>
                            <div className="flex flex-col gap-0.5">
                                <h1 className="text-xl lg:text-2xl font-heading font-bold text-dark tracking-tight">Admin Console</h1>
                                <p className="hidden md:block text-muted font-body text-sm">Welcome back. Manage your platform efficiently.</p>
                                <p className="md:hidden text-[10px] font-bold uppercase tracking-widest text-secondary">Dashboard</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative group hidden sm:block">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search dashboard..."
                                    className="pl-11 pr-6 py-2.5 bg-gray-50 rounded-full border border-gray-200 text-dark text-sm focus:border-dark focus:ring-1 focus:ring-dark focus:outline-none transition-all w-64 placeholder:text-muted"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
