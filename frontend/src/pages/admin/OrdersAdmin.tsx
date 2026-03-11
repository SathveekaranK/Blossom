import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Loader2,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    User as UserIcon,
    Package,
    MapPin,
    Calendar,
    X
} from 'lucide-react';
import api from '../../api/api';

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        imageUrl?: string;
    };
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    shippingAddress: string | null;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}

const statusColors: any = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    PAID: 'bg-blue-50 text-blue-600 border-blue-100',
    SHIPPED: 'bg-primary/10 text-primary border-primary/20',
    DELIVERED: 'bg-secondary/10 text-secondary border-secondary/20',
    CANCELLED: 'bg-red-50 text-red-500 border-red-100',
};

const statusIcons: any = {
    PENDING: Clock,
    PAID: Loader2,
    SHIPPED: Truck,
    DELIVERED: CheckCircle2,
    CANCELLED: XCircle,
};

const OrdersAdmin = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            const response = await api.get(`/orders?status=${statusFilter}`);
            setOrders(response.data);
        } catch (err) {
            console.error('Failed to fetch orders');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            fetchOrders();
            if (selectedOrder?.id === id) {
                setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
            }
        } catch (err) {
            alert('Status update failed');
        }
    };

    const filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-dark tracking-tight">Order Fulfillment</h2>
                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Process customer purchases</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs font-bold bg-white border border-gray-100 rounded-xl px-4 py-2 focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-sm"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by order ID or user..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-sm font-medium focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Order Ref</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Items</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const StatusIcon = statusIcons[order.status] || Clock;
                                    return (
                                        <tr 
                                            key={order.id} 
                                            className="hover:bg-gray-50/30 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-black text-dark/40 uppercase tracking-tighter">#{order.id.slice(-8)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <UserIcon className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-dark text-sm">{order.user.name}</span>
                                                        <span className="text-[10px] font-medium text-gray-400">{order.user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-gray-500">{order.items.length} items</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-black text-dark">${order.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit ${statusColors[order.status] || ''}`}>
                                                    <StatusIcon className={`w-3 h-3 ${order.status === 'PAID' ? 'animate-spin' : ''}`} />
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    className="text-xs font-bold bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PAID">Paid</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/20 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-10 border-b border-gray-50 flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-black text-dark tracking-tight">Order #{selectedOrder.id.slice(-8)}</h3>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusColors[selectedOrder.status]}`}>
                                            {selectedOrder.status}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Detailed Transaction Log</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                    {/* Info Side */}
                                    <div className="flex flex-col gap-8">
                                        <div className="flex flex-col gap-4">
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                <UserIcon className="w-3 h-3" /> Customer Details
                                            </h4>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-dark">{selectedOrder.user.name}</span>
                                                <span className="text-xs text-gray-500">{selectedOrder.user.email}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> Shipping Address
                                            </h4>
                                            <p className="text-sm font-medium text-gray-600 leading-relaxed italic">
                                                {selectedOrder.shippingAddress || 'No address provided'}
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar className="w-3 h-3" /> Placed On
                                            </h4>
                                            <span className="text-sm font-bold text-dark">
                                                {new Date(selectedOrder.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items Side */}
                                    <div className="md:col-span-2 flex flex-col gap-6">
                                        <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                            <Package className="w-3 h-3" /> Order Items ({selectedOrder.items.length})
                                        </h4>
                                        <div className="flex flex-col gap-4">
                                            {selectedOrder.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                                                    <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm flex-shrink-0">
                                                        {item.product.imageUrl ? (
                                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                                <Package className="w-8 h-8" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col gap-1">
                                                        <span className="text-sm font-bold text-dark">{item.product.name}</span>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-black text-dark">${(item.price * item.quantity).toFixed(2)}</span>
                                                        <p className="text-[10px] font-medium text-gray-400">${item.price.toFixed(2)} / unit</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Order Subtotal</span>
                                            <span className="text-3xl font-black text-dark tracking-tighter">${selectedOrder.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Lifecycle Status</p>
                                <div className="flex gap-3">
                                    {['PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                selectedOrder.status === s 
                                                ? 'bg-dark text-white shadow-lg' 
                                                : 'bg-white text-dark hover:bg-gray-100 border border-gray-200'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrdersAdmin;
