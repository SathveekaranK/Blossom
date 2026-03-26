import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Package,
    Loader2,
    Clock,
    CheckCircle2,
    Truck,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    MapPin,
    Calendar,
    Receipt
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
    ORDER: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock, label: 'Order Placed' },
    SHIPPED: { color: 'bg-orange-50 text-orange-700 border-orange-200', icon: Truck, label: 'Shipped' },
    DELIVERED: { color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2, label: 'Delivered' },
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
            <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-dark" />
                <span className="text-sm font-semibold text-muted">Loading your orders...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col gap-6 mb-12">
                    <Link to="/" className="flex items-center gap-2 text-muted text-sm font-semibold w-fit hover:text-dark transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-4xl font-heading font-bold text-dark tracking-tight">My Orders</h1>
                            <p className="text-sm text-muted font-body">View and track your previous purchases.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-dark shadow-sm">
                            <Receipt className="w-4 h-4 text-muted" />
                            {orders.length} Orders
                        </div>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center gap-6 py-24 bg-white rounded-[32px] border border-gray-100 shadow-sm px-6 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                            <Package className="w-10 h-10" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-heading font-bold text-dark tracking-tight">No Orders Found</h2>
                            <p className="text-sm text-muted max-w-sm mx-auto">
                                You haven't placed any orders yet. Start exploring our collection!
                            </p>
                        </div>
                        <Link to="/shop" className="btn-primary mt-2">
                            Shop Now
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
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
                                >
                                    <button
                                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                        className="w-full p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4 sm:gap-6">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-2xl border border-gray-100 flex-shrink-0 flex items-center justify-center p-2">
                                                {order.items[0]?.product.imageUrl ? (
                                                    <img src={resolveImageUrl(order.items[0].product.imageUrl)} alt={order.items[0].product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                ) : (
                                                    <Package className="w-8 h-8 text-gray-300" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-dark">Order #{order.id.slice(-8).toUpperCase()}</span>
                                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {statusInfo.label}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted">
                                                    <span className="font-medium text-dark/70">
                                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="hidden sm:inline text-gray-300">•</span>
                                                    <span className="line-clamp-1">
                                                        {order.items[0]?.product.name || 'Products'}
                                                        {order.items.length > 1 && (
                                                            <span className="font-semibold text-dark ml-1">
                                                                + {order.items.length - 1} more
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between w-full md:w-auto gap-6 sm:gap-10 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 md:pl-8 md:border-l">
                                            <div className="flex flex-col md:items-end">
                                                <span className="text-xs font-medium text-muted mb-0.5">Total Amount</span>
                                                <span className="text-lg font-bold text-dark">₹{Number(order.totalAmount).toFixed(2)}</span>
                                            </div>
                                            <div className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                                {isExpanded ? <ChevronUp className="w-5 h-5 text-dark" /> : <ChevronDown className="w-5 h-5 text-muted" />}
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="border-t border-gray-100 bg-gray-50/50"
                                            >
                                                <div className="p-6 sm:p-8">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                        {/* Items Side */}
                                                        <div className="flex flex-col gap-6">
                                                            <h3 className="text-sm font-bold text-dark uppercase tracking-wider flex items-center gap-2 mb-2">
                                                                Order Items ({order.items.length})
                                                            </h3>
                                                            
                                                            <div className="flex flex-col gap-4">
                                                                {order.items.map((item) => (
                                                                    <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                                        <Link 
                                                                            to={`/products/${item.product.slug}`}
                                                                            className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center p-1"
                                                                        >
                                                                            {item.product.imageUrl ? (
                                                                                <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                                            ) : (
                                                                                <Package className="w-6 h-6 text-gray-300" />
                                                                            )}
                                                                        </Link>
                                                                        <div className="flex-1 flex flex-col gap-1">
                                                                            <Link 
                                                                                to={`/products/${item.product.slug}`}
                                                                                className="text-sm font-semibold text-dark hover:text-secondary transition-colors line-clamp-1"
                                                                            >
                                                                                {item.product.name}
                                                                            </Link>
                                                                            <span className="text-xs text-muted font-medium">Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}</span>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <span className="text-sm font-bold text-dark">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Info Side */}
                                                        <div className="flex flex-col justify-between gap-8 md:pl-8 md:border-l border-gray-200">
                                                            <div className="flex flex-col gap-6">
                                                                <div className="flex flex-col gap-2">
                                                                    <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                                                                        <MapPin className="w-4 h-4 text-dark" /> Shipping Address
                                                                    </h4>
                                                                    <div className="text-sm text-dark font-medium leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                                                        {order.houseNo ? (
                                                                            <>
                                                                                <p>{order.houseNo}, {order.street}</p>
                                                                                {order.landmark && <p className="text-muted text-xs mt-0.5">Near {order.landmark}</p>}
                                                                                <p>{order.area}, {order.district}</p>
                                                                                <p>{order.state}, {order.country} — {order.pincode}</p>
                                                                            </>
                                                                        ) : (
                                                                            <p>{order.shippingAddress || 'Address details missing.'}</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="flex flex-col gap-2">
                                                                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                                                                            <Calendar className="w-4 h-4 text-dark" /> Order Date
                                                                        </h4>
                                                                        <span className="text-sm font-semibold text-dark">
                                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-col gap-2">
                                                                        <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                                                                            <Receipt className="w-4 h-4 text-dark" /> Total
                                                                        </h4>
                                                                        <span className="text-lg font-bold text-dark">
                                                                            ₹{Number(order.totalAmount).toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
