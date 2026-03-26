import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Package, ShoppingBag, TrendingUp, Users, Bell, Loader2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/api';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    activeProducts: number;
    subscriberCount: number;
    orderChange: string;
    recentOrders: any[];
}

const DashboardHome = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/orders/dashboard-stats');
            setStats(res.data);
        } catch (err) {
            console.error('Failed to load stats');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="w-10 h-10 animate-spin text-dark" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: IndianRupee, change: stats?.orderChange || '+0%', color: 'bg-green-50 text-green-700', iconColor: 'text-green-600' },
        { name: 'Total Orders', value: String(stats?.totalOrders || 0), icon: ShoppingBag, change: stats?.orderChange || '+0%', color: 'bg-blue-50 text-blue-700', iconColor: 'text-blue-600' },
        { name: 'Active Users', value: String(stats?.activeUsers || 0), icon: Users, change: '', color: 'bg-indigo-50 text-indigo-700', iconColor: 'text-indigo-600' },
        { name: 'Active Products', value: String(stats?.activeProducts || 0), icon: Package, change: '', color: 'bg-purple-50 text-purple-700', iconColor: 'text-purple-600' },
    ];

    return (
        <div className="flex flex-col gap-6 lg:gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-6 group hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-2xl ${stat.color}`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                            {stat.change && (
                                <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>{stat.change}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">{stat.name}</span>
                            <span className="text-3xl font-heading font-bold text-dark tracking-tight">{stat.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="lg:col-span-2 p-8 bg-white rounded-3xl border border-primary/10 shadow-sm">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
                        <h3 className="text-xl font-heading font-bold text-dark tracking-tight">Recent Orders</h3>
                        <Link to="/admin/orders" className="text-sm font-semibold text-dark hover:text-secondary flex items-center gap-1 transition-colors">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="flex flex-col gap-3">
                            {stats.recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-primary/10 hover:border-primary/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-primary/10 flex items-center justify-center flex-shrink-0">
                                            <ShoppingBag className="w-5 h-5 text-muted" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-dark">{order.user?.name || order.user?.email || 'Guest'}</span>
                                            <span className="text-xs font-medium text-muted mt-0.5">
                                                {order.items?.length} items • {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                            order.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border-green-200'
                                                : order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>{order.status}</span>
                                        <span className="text-sm font-bold text-dark w-20 text-right">₹{Number(order.totalAmount).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-primary/10 text-center gap-3">
                            <ShoppingBag className="w-8 h-8 text-gray-300" />
                            <span className="text-sm font-semibold text-muted">No orders yet.</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6 lg:gap-8">
                    {/* Subscriber Count Card */}
                    <div className="p-8 bg-white rounded-3xl border border-primary/10 shadow-sm flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                                <Bell className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted">Subscribers</span>
                            <span className="text-4xl font-heading font-bold text-dark tracking-tight">{stats?.subscriberCount || 0}</span>
                        </div>
                        <p className="text-sm text-muted font-medium bg-white p-4 rounded-xl border border-primary/10">
                            Users subscribed for new product notifications and marketing updates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
