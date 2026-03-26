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
    ORDER: 'bg-amber-50 text-amber-700 border-amber-200',
    SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
    DELIVERED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">Order Fulfillment</h2>
                    <p className="text-sm text-muted font-body">Process and manage customer purchases.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 p-1 bg-light rounded-xl border border-primary/10 shadow-sm w-fit">
                    {['ALL', 'ORDER', 'SHIPPED', 'DELIVERED'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                statusFilter === s
                                ? 'bg-white text-dark shadow-sm'
                                : 'text-muted hover:text-dark hover:bg-white'
                            }`}
                        >
                            {s === 'ALL' ? 'All Orders' : s.charAt(0) + s.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-dark transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm focus:outline-none transition-all placeholder:text-muted"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/50 border-b border-primary/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Order Ref</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Items</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Total</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-dark mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="text-muted font-medium text-sm">No orders found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const StatusIcon = statusIcons[order.status] || Clock;
                                    return (
                                        <tr 
                                            key={order.id} 
                                            className="hover:bg-primary/50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedOrder(order)}
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-semibold text-dark">#{order.id.slice(-8).toUpperCase()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-light rounded-full flex items-center justify-center text-muted border border-primary/10 flex-shrink-0">
                                                        <UserIcon className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-dark text-sm">{order.user.name}</span>
                                                        <span className="text-xs font-medium text-muted">{order.user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-dark bg-light px-3 py-1 rounded-full">{order.items.length} items</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-dark">₹{order.totalAmount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border w-fit transition-all ${statusColors[order.status] || 'bg-light text-dark border-primary/10'}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {['ORDER', 'SHIPPED', 'DELIVERED'].map((s) => (
                                                        <button
                                                            key={s}
                                                            onClick={() => order.status !== s && requestStatusUpdate(order.id, s)}
                                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${
                                                                order.status === s
                                                                ? 'bg-dark text-white border-dark cursor-default'
                                                                : 'bg-white text-dark border-primary/10 hover:bg-white'
                                                            }`}
                                                        >
                                                            {s.charAt(0) + s.slice(1).toLowerCase()}
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-primary/10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 sm:p-8 border-b border-primary/10 flex items-center justify-between bg-white z-10">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-heading font-bold text-dark tracking-tight">Order #{selectedOrder.id.slice(-8).toUpperCase()}</h3>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold ${statusColors[selectedOrder.status]}`}>
                                            {selectedOrder.status.charAt(0) + selectedOrder.status.slice(1).toLowerCase()}
                                        </div>
                                    </div>
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Detailed Transaction Overview</p>
                                </div>
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="p-2 bg-white rounded-full hover:bg-light transition-colors border border-primary/10"
                                >
                                    <X className="w-5 h-5 text-dark" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-gray-50/30">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Info Side */}
                                    <div className="flex flex-col gap-6">
                                        <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-4">
                                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                                <UserIcon className="w-4 h-4" /> Customer Details
                                            </h4>
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-dark text-sm">{selectedOrder.user.name}</span>
                                                <span className="text-sm text-muted">{selectedOrder.user.email}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-4">
                                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                                <MapPin className="w-4 h-4" /> Shipping Address
                                            </h4>
                                            <div className="text-sm text-dark leading-relaxed flex flex-col">
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

                                        <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-4">
                                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Placed On
                                            </h4>
                                            <span className="text-sm font-semibold text-dark">
                                                {new Date(selectedOrder.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items Side */}
                                    <div className="md:col-span-2 flex flex-col gap-6">
                                        <div className="bg-white p-6 rounded-2xl border border-primary/10 shadow-sm flex flex-col gap-6">
                                            <h4 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                                                <Package className="w-4 h-4" /> Order Items ({selectedOrder.items.length})
                                            </h4>
                                            <div className="flex flex-col gap-4 divide-y divide-gray-100">
                                                {selectedOrder.items.map((item) => (
                                                    <div key={item.id} className="flex items-center gap-4 pt-4 first:pt-0">
                                                        <div className="w-16 h-16 bg-white overflow-hidden flex-shrink-0 border border-primary/10 rounded-xl p-1 shadow-sm flex items-center justify-center">
                                                            {item.product.imageUrl ? (
                                                                <img src={resolveImageUrl(item.product.imageUrl)} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 flex flex-col gap-1">
                                                            <span className="text-sm font-semibold text-dark">{item.product.name}</span>
                                                            <span className="text-xs font-medium text-muted bg-light px-2 py-0.5 rounded-md w-fit">Qty: {item.quantity}</span>
                                                        </div>
                                                        <div className="text-right flex flex-col gap-1">
                                                            <span className="text-sm font-bold text-dark">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                            <p className="text-xs font-medium text-muted">₹{item.price.toFixed(2)} / unit</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-2 pt-6 border-t border-primary/10 flex justify-between items-center">
                                                <span className="text-sm font-bold text-muted uppercase tracking-wider">Order Total</span>
                                                <span className="text-2xl font-heading font-bold text-dark tracking-tight">₹{selectedOrder.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 bg-white border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                                <p className="text-xs font-bold text-muted uppercase tracking-wider">Update Order Status</p>
                                <div className="flex gap-3 w-full sm:w-auto">
                                    {['ORDER', 'SHIPPED', 'DELIVERED'].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => selectedOrder.status !== s && requestStatusUpdate(selectedOrder.id, s)}
                                            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                                                selectedOrder.status === s 
                                                ? 'bg-dark text-white border-dark shadow-md cursor-default' 
                                                : 'bg-white text-dark border-primary/10 hover:bg-white'
                                            }`}
                                        >
                                            {s.charAt(0) + s.slice(1).toLowerCase()}
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
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
                            onClick={() => setConfirmModal(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-3xl border border-primary/10 p-8 w-full max-w-sm flex flex-col items-center gap-6 shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-amber-50 rounded-full border border-amber-100 flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h3 className="text-xl font-heading font-bold text-dark tracking-tight">Confirm Status Change</h3>
                                <p className="text-sm text-muted">
                                    Are you sure you want to update this order to <span className="font-bold text-dark">{confirmModal.newStatus.charAt(0) + confirmModal.newStatus.slice(1).toLowerCase()}</span>?
                                </p>
                            </div>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setConfirmModal(null)}
                                    className="flex-1 py-3 bg-white border border-primary/10 text-dark font-semibold text-sm rounded-xl hover:bg-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmStatusUpdate}
                                    className="flex-1 py-3 bg-dark text-white font-semibold text-sm rounded-xl hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
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
