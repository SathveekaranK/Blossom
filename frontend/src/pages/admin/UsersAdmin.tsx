import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Loader2,
    User as UserIcon,
    Shield,
    ShoppingBag,
    Bell,
    Mail,
    Calendar,
    ChevronDown,
    ChevronUp,
    Eye
} from 'lucide-react';
import api from '../../api/api';

interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
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
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-dark tracking-tight">Registered Users</h2>
                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">View and manage user accounts</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-2xl">
                        <UserIcon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-black text-primary">{users.length} Total Users</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-2xl">
                        <Bell className="w-4 h-4 text-secondary" />
                        <span className="text-xs font-black text-secondary">
                            {users.filter(u => u.isSubscribed).length} Subscribers
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
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
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">User</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Subscription</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Orders</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Joined</th>
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
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <>
                                        <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black shadow-sm ${user.role === 'ADMIN' ? 'bg-dark' : 'bg-primary/80'}`}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-bold text-dark">{user.name}</span>
                                                        <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" /> {user.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${user.role === 'ADMIN'
                                                    ? 'bg-dark text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                                                    {user.role}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${user.isSubscribed
                                                    ? 'bg-secondary/10 text-secondary border border-secondary/20'
                                                    : 'bg-gray-50 text-gray-300'
                                                    }`}>
                                                    <Bell className="w-3 h-3" />
                                                    {user.isSubscribed ? 'Subscribed' : 'Not subscribed'}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5">
                                                    <ShoppingBag className="w-3.5 h-3.5 text-gray-300" />
                                                    <span className="text-sm font-black text-dark">{user._count.orders}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => handleViewDetails(user.id)}
                                                    className="p-2.5 rounded-xl hover:bg-white hover:shadow-md text-gray-400 hover:text-dark transition-all inline-flex items-center gap-1"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    {expandedUser === user.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedUser === user.id && (
                                            <tr key={`${user.id}-details`}>
                                                <td colSpan={6} className="px-8 py-6 bg-gray-50/50">
                                                    {detailLoading ? (
                                                        <div className="flex justify-center py-8">
                                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                                        </div>
                                                    ) : userDetails ? (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: -10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="flex flex-col gap-4"
                                                        >
                                                            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Recent Orders</h4>
                                                            {userDetails.orders && userDetails.orders.length > 0 ? (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {userDetails.orders.map((order: any) => (
                                                                        <div key={order.id} className="p-5 bg-white rounded-2xl border border-gray-100 flex flex-col gap-3">
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-[10px] font-black text-dark/40 uppercase tracking-widest">#{order.id.slice(-8)}</span>
                                                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${order.status === 'PAID' ? 'bg-secondary/10 text-secondary'
                                                                                    : order.status === 'DELIVERED' ? 'bg-primary/10 text-primary'
                                                                                        : order.status === 'CANCELLED' ? 'bg-red-50 text-red-500'
                                                                                            : 'bg-amber-50 text-amber-600'
                                                                                    }`}>{order.status}</span>
                                                                            </div>
                                                                            <div className="flex items-center justify-between">
                                                                                <span className="text-xs font-medium text-gray-400">
                                                                                    {order.items.length} items
                                                                                </span>
                                                                                <span className="text-sm font-black text-dark">${Number(order.totalAmount).toFixed(2)}</span>
                                                                            </div>
                                                                            <span className="text-[10px] text-gray-300">
                                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">No orders yet.</p>
                                                            )}
                                                        </motion.div>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        )}
                                    </>
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
