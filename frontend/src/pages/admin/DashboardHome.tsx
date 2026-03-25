import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Package, ShoppingBag, TrendingUp, Users, Bell, Loader2 } from 'lucide-react';
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
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: IndianRupee, change: stats?.orderChange || '0%', color: 'bg-primary' },
        { name: 'Total Orders', value: String(stats?.totalOrders || 0), icon: ShoppingBag, change: stats?.orderChange || '0%', color: 'bg-secondary' },
        { name: 'Active Users', value: String(stats?.activeUsers || 0), icon: Users, change: '', color: 'bg-primary-dark/50' },
        { name: 'Active Products', value: String(stats?.activeProducts || 0), icon: Package, change: '', color: 'bg-dark' },
    ];

    return (
        <div className="flex flex-col gap-6 lg:gap-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 bg-white border border-gray-50 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-4 ${stat.color} text-white rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            {stat.change && (
                                <div className="flex items-center gap-1 text-[11px] font-black tracking-[0.1em] text-secondary uppercase bg-secondary/5 px-2 py-0.5 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{stat.change}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{stat.name}</span>
                            {/* The instruction changed this line, assuming 'stats.revenue' refers to 'stats.totalRevenue' */}
                            {stat.name === 'Total Revenue' ? (
                                <span className="text-2xl font-black text-dark tracking-tighter">₹{(stats?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            ) : (
                                <span className="text-3xl font-black text-dark tracking-tighter">{stat.value}</span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-10 bg-white border border-gray-50 rounded-[40px] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-dark tracking-tight">Recent Orders</h3>
                        <Link to="/admin/orders" className="text-xs font-bold text-gray-400 hover:text-dark uppercase tracking-widest">View All</Link>
                    </div>
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {stats.recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-dark/5 flex items-center justify-center">
                                            <ShoppingBag className="w-5 h-5 text-dark/30" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-dark">{order.user?.name}</span>
                                            <span className="text-[10px] font-medium text-gray-400">
                                                {order.items?.length} items • {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${order.status === 'PAID' ? 'bg-secondary/10 text-secondary'
                                            : order.status === 'DELIVERED' ? 'bg-primary/10 text-primary'
                                                : order.status === 'CANCELLED' ? 'bg-red-50 text-red-500'
                                                    : order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600'
                                                        : 'bg-amber-50 text-amber-600'
                                            }`}>{order.status}</span>
                                        <span className="text-xs font-black text-dark italic">₹{Number(order.totalAmount).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center p-20 border-2 border-dashed border-gray-50 rounded-[30px] bg-gray-50/20">
                            <span className="text-gray-300 font-bold uppercase tracking-[0.3em] text-xs">No orders yet.</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-8">
                    {/* Subscriber Count Card */}
                    <div className="p-8 bg-white border border-gray-50 rounded-[32px] shadow-sm flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-secondary/10 rounded-2xl">
                                <Bell className="w-5 h-5 text-secondary" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Subscribers</span>
                            <span className="text-3xl font-black text-dark tracking-tighter">{stats?.subscriberCount || 0}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Users subscribed for new product notifications.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
