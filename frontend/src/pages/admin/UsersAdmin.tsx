import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Loader2,
    User as UserIcon,
    Shield,
    ShoppingBag,
    Mail,
    Calendar,
    ChevronDown,
    ChevronUp,
    X
} from 'lucide-react';
import api from '../../api/api';

interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    phone: string;
    isSubscribed: boolean;
    createdAt: string;
    _count: { orders: number };
}

const UsersAdmin = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedUser, setExpandedUser] = useState<string | null>(null);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error('Failed to fetch users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDetails = async (userId: string) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            setUserDetails(null);
            return;
        }
        setExpandedUser(userId);
        setDetailLoading(true);
        try {
            const response = await api.get(`/users/${userId}`);
            setUserDetails(response.data);
        } catch (err) {
            console.error('Failed to fetch user details');
        } finally {
            setDetailLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">Registered Users</h2>
                    <p className="text-sm text-muted font-body">Manage customer accounts and viewing activity.</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-gray-100 px-5 py-2.5 rounded-2xl shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-dark">
                        <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-dark">{users.length}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Total Users</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-dark transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm focus:outline-none transition-all placeholder:text-muted"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Phone</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Role</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Orders</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Joined</th>
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
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="text-muted font-medium text-sm">No users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <tr className={`transition-colors group ${expandedUser === user.id ? 'bg-gray-50/50' : 'hover:bg-gray-50/50'}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-xl flex-shrink-0 shadow-sm border ${user.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-white text-dark border-gray-200'}`}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-semibold text-dark text-sm">{user.name}</span>
                                                        <span className="text-xs font-medium text-muted flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-gray-400" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-muted">
                                                    {user.phone || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border w-fit ${user.role === 'ADMIN'
                                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                                    : 'bg-gray-100 text-dark border-gray-200'
                                                    }`}>
                                                    {user.role === 'ADMIN' && <Shield className="w-3.5 h-3.5" />}
                                                    {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-dark">
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-sm font-bold text-dark">{user._count.orders}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-muted text-sm font-medium">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleViewDetails(user.id)}
                                                    className={`p-2 rounded-xl transition-all inline-flex items-center justify-center border ${expandedUser === user.id ? 'bg-dark text-white border-dark shadow-md' : 'bg-white text-dark border-gray-200 hover:bg-gray-50'}`}
                                                    title="View Details"
                                                >
                                                    {expandedUser === user.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                </button>
                                            </td>
                                        </tr>
                                        <AnimatePresence>
                                            {expandedUser === user.id && (
                                                <tr key={`${user.id}-details`}>
                                                    <td colSpan={6} className="p-0 border-b border-gray-100">
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-gray-50 border-x-4 border-l-dark border-r-transparent"
                                                        >
                                                            <div className="p-6 sm:p-8">
                                                                {detailLoading ? (
                                                                    <div className="flex justify-center py-8">
                                                                        <Loader2 className="w-6 h-6 animate-spin text-dark" />
                                                                    </div>
                                                                ) : userDetails ? (
                                                                    <div className="flex flex-col gap-6">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-sm font-bold uppercase tracking-wider text-dark flex items-center gap-2">
                                                                                <ShoppingBag className="w-4 h-4" />
                                                                                Recent Orders
                                                                            </h4>
                                                                        </div>
                                                                        {userDetails.orders && userDetails.orders.length > 0 ? (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                                {userDetails.orders.map((order: any) => (
                                                                                    <div key={order.id} className="p-5 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <span className="text-xs font-bold text-dark uppercase tracking-wider">#{order.id.slice(-8)}</span>
                                                                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                                                                                                order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                                                    : order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                                                                }`}>{order.status}</span>
                                                                                        </div>
                                                                                        <div className="flex items-center justify-between">
                                                                                            <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-md text-muted">
                                                                                                {order.items.length} items
                                                                                            </span>
                                                                                            <span className="text-base font-bold text-dark">₹{Number(order.totalAmount).toFixed(2)}</span>
                                                                                        </div>
                                                                                        <span className="text-xs text-muted font-medium flex items-center gap-1.5 pt-4 border-t border-gray-100">
                                                                                            <Calendar className="w-3.5 h-3.5" />
                                                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                                                        </span>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-sm font-medium text-muted bg-white p-6 rounded-2xl border border-gray-200 text-center">No order history available.</p>
                                                                        )}
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersAdmin;
