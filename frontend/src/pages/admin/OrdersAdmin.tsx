import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Loader2,
    CheckCircle2,
    Clock,
    Truck,
    User as UserIcon,
    Package,
    MapPin,
    Calendar,
    X,
    AlertTriangle
} from 'lucide-react';
import api from '../../api/api';
import { resolveImageUrl } from '../../utils/imageUtils';

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
    houseNo?: string;
    street?: string;
    landmark?: string;
    area?: string;
    district?: string;
    state?: string;
    country?: string;
    pincode?: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}

const statusColors: any = {
    ORDER: 'bg-amber-50 text-amber-600 border-amber-100',
    SHIPPED: 'bg-blue-50 text-blue-600 border-blue-100',
    DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
};

const statusIcons: any = {
    ORDER: Clock,
    SHIPPED: Truck,
    DELIVERED: CheckCircle2,
};

const OrdersAdmin = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [confirmModal, setConfirmModal] = useState<{ orderId: string; newStatus: string } | null>(null);

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

    const requestStatusUpdate = (id: string, newStatus: string) => {
        setConfirmModal({ orderId: id, newStatus });
    };

    const confirmStatusUpdate = async () => {
        if (!confirmModal) return;
        try {
            await api.put(`/orders/${confirmModal.orderId}/status`, { status: confirmModal.newStatus });
            fetchOrders();
            if (selectedOrder?.id === confirmModal.orderId) {
                setSelectedOrder(prev => prev ? { ...prev, status: confirmModal.newStatus } : null);
            }
        } catch (err) {
            alert('Status update failed');
        } finally {
            setConfirmModal(null);
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
                <div className="flex items-center gap-2">
                    {['ALL', 'ORDER', 'SHIPPED', 'DELIVERED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                statusFilter === s
                                ? 'bg-dark text-white shadow-lg'
                                : 'bg-white text-dark hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {s === 'ALL' ? 'All' : s}
                        </button>
                    ))}
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
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[120px]">Order Ref</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[250px]">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[120px]">Items</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[120px]">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[150px]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right min-w-[150px]">Actions</th>
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
                                                <span className="text-xs font-black text-dark italic">₹{order.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit ${statusColors[order.status] || ''}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-1.5 justify-end">
                                                    {['ORDER', 'SHIPPED', 'DELIVERED'].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => order.status !== s && requestStatusUpdate(order.id, s)}
                                                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                order.status === s
                                                                ? 'bg-dark text-white shadow-md cursor-default'
                                                                : 'bg-gray-50 text-dark/60 hover:bg-gray-100 border border-gray-100'
                                                            }`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
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
                                            <div className="text-sm font-medium text-gray-600 leading-relaxed italic flex flex-col">
                                                {selectedOrder.houseNo ? (
                                                    <>
                                                        <span>{selectedOrder.houseNo}, {selectedOrder.street}</span>
                                                        {selectedOrder.landmark && <span>{selectedOrder.landmark}</span>}
                                                        <span>{selectedOrder.area}, {selectedOrder.district}</span>
                                                        <span>{selectedOrder.state}, {selectedOrder.country} - {selectedOrder.pincode}</span>
                                                    </>
                                                ) : (
                                                    <span>{selectedOrder.shippingAddress || 'No address provided'}</span>
                                                )}
                                            </div>
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
                                                            <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} className="w-full h-full object-cover" />
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
                                                        <span className="text-xs font-black text-dark italic">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                        <p className="text-[10px] font-medium text-gray-400">₹{item.price.toFixed(2)} / unit</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 pt-6 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Order Subtotal</span>
                                            <span className="text-xl font-black text-dark tracking-tighter">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update Lifecycle Status</p>
                                <div className="flex gap-3">
                                    {['ORDER', 'SHIPPED', 'DELIVERED'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => selectedOrder.status !== s && requestStatusUpdate(selectedOrder.id, s)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                selectedOrder.status === s 
                                                ? 'bg-dark text-white shadow-lg cursor-default' 
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

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/30 backdrop-blur-sm"
                            onClick={() => setConfirmModal(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[32px] shadow-2xl p-10 w-full max-w-md flex flex-col items-center gap-6"
                        >
                            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="text-xl font-black text-dark tracking-tight">Confirm Status Change</h3>
                                <p className="text-sm text-gray-400 font-medium text-center">
                                    Update this order to <span className="font-black text-dark">{confirmModal.newStatus}</span>?
                                </p>
                            </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 py-3.5 bg-gray-100 text-dark rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    className="flex-1 py-3.5 bg-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrdersAdmin;
