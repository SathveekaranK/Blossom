import { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    User as UserIcon
} from 'lucide-react';
import api from '../../api/api';

interface OrderItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        price: number;
    };
}

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
    items: OrderItem[];
}

const statusColors: any = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    PROCESSING: 'bg-blue-50 text-blue-600 border-blue-100',
    SHIPPED: 'bg-primary/10 text-primary border-primary/20',
    DELIVERED: 'bg-secondary/10 text-secondary border-secondary/20',
    CANCELLED: 'bg-red-50 text-red-500 border-red-100',
};

const statusIcons: any = {
    PENDING: Clock,
    PROCESSING: Loader2,
    SHIPPED: Truck,
    DELIVERED: CheckCircle2,
    CANCELLED: XCircle,
};

const OrdersAdmin = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
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
        } catch (err) {
            alert('Status update failed');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-dark tracking-tight">Order Fulfillment</h2>
                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Process customer purchases</p>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by order ID or user..."
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
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No orders yet.</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const StatusIcon = statusIcons[order.status];
                                    return (
                                        <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
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
                                                <span className="text-sm font-black text-dark">${order.total.toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest w-fit ${statusColors[order.status]}`}>
                                                    <StatusIcon className={`w-3 h-3 ${order.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                                    className="text-xs font-bold bg-gray-50 border-none rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="PROCESSING">Processing</option>
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
        </div>
    );
};

export default OrdersAdmin;
