import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Package,
    ShoppingBag,
    Loader2,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    CreditCard,
    ArrowLeft,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import api from '../api/api';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        imageUrl?: string;
        slug: string;
    };
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    shippingAddress?: string;
    createdAt: string;
    items: OrderItem[];
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    PENDING: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, label: 'Pending' },
    PAID: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: CreditCard, label: 'Paid' },
    SHIPPED: { color: 'bg-primary/10 text-primary border-primary/20', icon: Truck, label: 'Shipped' },
    DELIVERED: { color: 'bg-secondary/10 text-secondary border-secondary/20', icon: CheckCircle2, label: 'Delivered' },
    CANCELLED: { color: 'bg-red-50 text-red-500 border-red-100', icon: XCircle, label: 'Cancelled' },
};

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/my-orders');
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="flex flex-col gap-6 mb-16">
                    <Link to="/" className="flex items-center gap-2 text-dark font-black hover:text-primary transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-[10px] uppercase tracking-widest">Back to Store</span>
                    </Link>
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-5xl font-black text-dark tracking-tighter">My Orders.</h1>
                            <p className="text-gray-400 font-medium">Track your purchase history and order status.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-dark/5 px-5 py-2.5 rounded-2xl">
                            <ShoppingBag className="w-5 h-5 text-dark/30" />
                            <span className="text-sm font-black text-dark">{orders.length} orders</span>
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-6 py-32"
                    >
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-200">
                            <Package className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-black text-dark tracking-tighter">No Orders Yet.</h2>
                        <p className="text-gray-400 font-medium max-w-xs text-center">
                            Start exploring our collection and your orders will appear here.
                        </p>
                        <Link to="/shop" className="px-10 py-4 bg-dark text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 hover:bg-primary transition-all">
                            Explore Collection
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order, index) => {
                            const statusInfo = statusConfig[order.status] || statusConfig['PENDING'];
                            const StatusIcon = statusInfo.icon;
                            const isExpanded = expandedOrder === order.id;

                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    className="bg-white border border-gray-100 rounded-[32px] overflow-hidden hover:shadow-lg hover:shadow-gray-100/50 transition-all"
                                >
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="w-full p-8 flex items-center justify-between text-left"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                                                <Package className="w-6 h-6 text-dark/20" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-dark">Order #{order.id.slice(-8).toUpperCase()}</span>
                                                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusInfo.label}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                                    {' • '}
                                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-xl font-black text-dark tracking-tight">${Number(order.totalAmount).toFixed(2)}</span>
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="border-t border-gray-50 px-8 pb-8"
                                        >
                                            <div className="flex flex-col gap-4 pt-6">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-5 p-4 bg-gray-50/50 rounded-2xl">
                                                        <div className="w-16 h-20 rounded-xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                                                            {item.product.imageUrl ? (
                                                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                                    <Package className="w-6 h-6" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            <Link to={`/products/${item.product.slug}`} className="text-sm font-bold text-dark hover:text-primary transition-colors">
                                                                {item.product.name}
                                                            </Link>
                                                            <span className="text-[10px] font-bold text-gray-400 capitalize">Qty: {item.quantity}</span>
                                                        </div>
                                                        <span className="text-sm font-black text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.shippingAddress && (
                                                <div className="mt-4 p-4 bg-primary/5 rounded-2xl">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Shipping Address</span>
                                                    <p className="text-sm font-medium text-dark mt-1">{order.shippingAddress}</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
