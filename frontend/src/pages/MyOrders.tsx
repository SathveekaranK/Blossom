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
    ArrowLeft,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import api from '../api/api';

import { resolveImageUrl } from '../utils/imageUtils';

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
    houseNo?: string;
    street?: string;
    landmark?: string;
    area?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
    createdAt: string;
    items: OrderItem[];
    user: {
        name: string;
        email: string;
    };
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    ORDER: { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Clock, label: 'Order' },
    SHIPPED: { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Truck, label: 'Shipped' },
    DELIVERED: { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: CheckCircle2, label: 'Delivered' },
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
                                            <div className="w-14 h-14 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 group-hover:scale-95 transition-transform duration-500">
                                                {order.items[0]?.product.imageUrl ? (
                                                    <img src={resolveImageUrl(order.items[0].product.imageUrl)} alt={order.items[0].product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-dark/20" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-black text-dark">Order #{order.id.slice(-8).toUpperCase()}</span>
                                                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {statusInfo.label}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-dark uppercase tracking-wider line-clamp-1 max-w-[200px]">
                                                        {order.items[0]?.product.name || 'Order'}
                                                        {order.items.length > 1 && (
                                                            <span className="text-primary ml-1">
                                                                + {order.items.length - 1} more
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-[10px] text-gray-300">•</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-xl font-black text-dark tracking-tighter">₹{Number(order.totalAmount).toFixed(2)}</span>
                                            {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="border-t border-gray-50 px-8 pb-8"
                                        >
                                            <div className="flex flex-col pt-8 bg-white border border-gray-100 rounded-[40px] shadow-sm overflow-hidden mt-6 mb-4">
                                                {/* Header within expansion to match modal */}
                                                <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-2xl font-black text-dark tracking-tight">Order #{order.id.slice(-8).toUpperCase()}</h3>
                                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusInfo.color}`}>
                                                                {statusInfo.label}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Detailed Transaction Log</p>
                                                    </div>
                                                </div>

                                                <div className="p-10">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                                        {/* Info Side */}
                                                        <div className="flex flex-col gap-8">
                                                            <div className="flex flex-col gap-4">
                                                                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-gray-200" /> Customer Details
                                                                </h4>
                                                                <div className="flex flex-col gap-1 text-left">
                                                                    <span className="font-bold text-dark">{order.user.name}</span>
                                                                    <span className="text-xs text-gray-500">{order.user.email}</span>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-4">
                                                                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-gray-200" /> Shipping Address
                                                                </h4>
                                                                <div className="text-sm font-medium text-gray-600 leading-relaxed italic text-left flex flex-col">
                                                                    {order.houseNo ? (
                                                                        <>
                                                                            <span>{order.houseNo}, {order.street}</span>
                                                                            {order.landmark && <span>{order.landmark}</span>}
                                                                            <span>{order.area}, {order.district}</span>
                                                                            <span>{order.state}, {order.country} - {order.pincode}</span>
                                                                        </>
                                                                    ) : (
                                                                        <span>{order.shippingAddress || 'No address provided'}</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-4">
                                                                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                                    <Clock className="w-3 h-3" /> Placed On
                                                                </h4>
                                                                <span className="text-sm font-bold text-dark text-left">
                                                                    {new Date(order.createdAt).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Items Side */}
                                                        <div className="md:col-span-2 flex flex-col gap-6">
                                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                                <Package className="w-3 h-3" /> Order Items ({order.items.length})
                                                            </h4>
                                                            <div className="flex flex-col gap-4">
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100/50 group/item">
                                                                        <Link 
                                                                            to={`/products/${item.product.slug}`}
                                                                            className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm flex-shrink-0 group-hover/item:scale-95 transition-transform duration-500 block border border-gray-100/30"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            {item.product.imageUrl ? (
                                                                                <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                                                    <Package className="w-8 h-8" />
                                                                                </div>
                                                                            )}
                                                                        </Link>
                                                                        <div className="flex-1 flex flex-col gap-1 text-left">
                                                                            <Link 
                                                                                to={`/products/${item.product.slug}`}
                                                                                className="text-sm font-bold text-dark hover:text-primary transition-colors inline-block w-fit"
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            >
                                                                                {item.product.name}
                                                                            </Link>
                                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="text-xs font-black text-dark italic tracking-tighter">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                                            <p className="text-[10px] font-medium text-gray-400">₹{Number(item.price).toFixed(2)} / unit</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between items-center">
                                                                <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Order Subtotal</span>
                                                                <span className="text-2xl font-black text-dark tracking-tighter">₹{Number(order.totalAmount).toFixed(2)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
