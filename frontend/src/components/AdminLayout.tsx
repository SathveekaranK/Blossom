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
    Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Products', icon: Package, path: '/admin/products' },
        { name: 'Categories', icon: Layers, path: '/admin/categories' },
        { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
        { name: 'Users', icon: Users, path: '/admin/users' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-100 flex flex-col p-6 gap-8 z-40">
                <Link to="/" className="flex items-center gap-3 px-2 mb-4 group">
                    <div className="w-10 h-10 rounded-2xl bg-dark text-white flex items-center justify-center group-hover:bg-primary transition-all duration-300">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="font-black text-xl tracking-tight">Main Site</span>
                </Link>

                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 px-4 mb-2">Management</span>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${location.pathname === item.path
                                    ? 'bg-primary/10 text-primary shadow-sm'
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-dark'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-2">
                    <Link
                        to="/admin/settings"
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 ${location.pathname === '/admin/settings'
                                ? 'bg-dark text-white shadow-lg shadow-black/10'
                                : 'text-gray-400 hover:bg-gray-50 hover:text-dark'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72 p-10">
                <header className="flex items-center justify-between mb-12">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-black text-dark tracking-tight">Admin Console</h1>
                        <p className="text-gray-400 font-semibold text-sm">Welcome back. Manage your digital boutique here.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search dashboard..."
                                className="pl-11 pr-6 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all w-64"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105">
                            <Plus className="w-4 h-4" />
                            <span>Quick Action</span>
                        </button>
                    </div>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
};

export default AdminLayout;
