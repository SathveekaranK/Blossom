import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Package, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../api/api';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: { name: string };
    isActive: boolean;
}

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: {
        quantity: number;
        product: { id: string; name: string };
    }[];
}

const ProductAnalysis = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/orders')
                ]);
                setProducts(productsRes.data);
                setOrders(ordersRes.data);
            } catch (err) {
                console.error('Failed to fetch analysis data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // --- Analytics Calculations ---

    // 1. Top Selling Products
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.filter(o => o.status !== 'CANCELLED').forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.product.id]) {
                productSales[item.product.id] = { name: item.product.name, quantity: 0, revenue: 0 };
            }
            productSales[item.product.id].quantity += item.quantity;
            // Best estimate for revenue since order item price might not be attached here directly, we use existing product price or just count quantity.
            const productRef = products.find(p => p.id === item.product.id);
            if (productRef) {
                productSales[item.product.id].revenue += item.quantity * productRef.price;
            }
        });
    });

    const topSelling = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);

    // 2. Low Stock Alerts
    const lowStockProducts = products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);

    // 3. Category Distribution
    const categoryCount: Record<string, number> = {};
    products.forEach(p => {
        const catName = p.category?.name || 'Uncategorized';
        categoryCount[catName] = (categoryCount[catName] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
    const maxCat = Math.max(...categoryData.map(c => c.count), 1);
    const maxTop = Math.max(...topSelling.map(s => s.quantity), 1);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-dark tracking-tight">Product Analysis</h2>
                    <p className="text-gray-400 font-medium text-sm mt-1">Deep dive into performance and inventory.</p>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Products</p>
                        <h3 className="text-3xl font-black text-dark tracking-tight">{products.length}</h3>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Items Sold</p>
                        <h3 className="text-3xl font-black text-dark tracking-tight">
                            {Object.values(productSales).reduce((acc, curr) => acc + curr.quantity, 0)}
                        </h3>
                    </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center gap-5">
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Low Stock Alerts</p>
                        <h3 className="text-3xl font-black text-dark tracking-tight">{lowStockProducts.length}</h3>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Selling Products Bar Chart (CSS) */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-dark">Top Performing Products</h3>
                        <BarChart3 className="w-5 h-5 text-gray-300" />
                    </div>
                    {topSelling.length === 0 ? (
                        <p className="text-sm text-gray-400">No sales data available yet.</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {topSelling.map((item, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between text-sm font-bold text-dark">
                                        <span className="truncate pr-4">{item.name}</span>
                                        <span className="flex-shrink-0 text-primary">{item.quantity} sold</span>
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(item.quantity / maxTop) * 100}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full bg-primary rounded-full relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -translate-x-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Left side items */}
                <div className="flex flex-col gap-8">
                    {/* Low Stock Alerts */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm">
                        <h3 className="text-lg font-black text-dark mb-6">Inventory Alerts <span className="text-xs ml-2 bg-amber-100 text-amber-700 px-2 py-1 rounded-lg">Low Stock</span></h3>
                        
                        {lowStockProducts.length === 0 ? (
                            <p className="text-sm text-gray-400">All products are well stocked.</p>
                        ) : (
                            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                                {lowStockProducts.map(p => (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-dark">{p.name}</span>
                                            <span className="text-[10px] font-black uppercase text-gray-400">{p.category?.name}</span>
                                        </div>
                                        <div className={`px-3 py-1 rounded-xl text-xs font-black ${p.stock === 0 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
                                            {p.stock} left
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Category Distribution (Progress Bars) */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-8 border border-gray-100 rounded-[32px] shadow-sm">
                        <h3 className="text-lg font-black text-dark mb-6">Category Distribution</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {categoryData.map((cat, i) => (
                                <div key={i} className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-12 h-12 rounded-full border-4 border-gray-100 relative flex items-center justify-center">
                                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                                            <circle cx="24" cy="24" r="20" fill="none" className="stroke-gray-200" strokeWidth="4" />
                                            <motion.circle 
                                                cx="24" cy="24" 
                                                r="20" 
                                                fill="none" 
                                                className="stroke-secondary" 
                                                strokeWidth="4" 
                                                strokeDasharray="125" 
                                                initial={{ strokeDashoffset: 125 }}
                                                animate={{ strokeDashoffset: 125 - (125 * (cat.count / maxCat)) }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                                            />
                                        </svg>
                                        <span className="text-xs font-black text-dark relative z-10">{cat.count}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-dark truncate w-20">{cat.name}</span>
                                        <span className="text-[10px] font-black uppercase text-gray-400">Items</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductAnalysis;
