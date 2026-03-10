import { motion } from 'framer-motion';
import { DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';

const stats = [
    { name: 'Total Revenue', value: '$12,450', icon: DollarSign, change: '+12%', color: 'bg-primary' },
    { name: 'Total Orders', value: '456', icon: ShoppingBag, change: '+8.2%', color: 'bg-secondary' },
    { name: 'Active Users', value: '1,230', icon: Users, change: '+15%', color: 'bg-primary-dark/50' },
    { name: 'Active Products', value: '12', icon: Package, change: '0%', color: 'bg-dark' },
];

const DashboardHome = () => {
    return (
        <div className="flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 bg-white border border-gray-50 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col gap-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`p-4 ${stat.color} text-white rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-black tracking-[0.1em] text-secondary uppercase bg-secondary/5 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">{stat.name}</span>
                            <span className="text-3xl font-black text-dark tracking-tighter">{stat.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-10 bg-white border border-gray-50 rounded-[40px] shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-dark tracking-tight">Recent Activity</h3>
                        <button className="text-xs font-bold text-gray-400 hover:text-dark uppercase tracking-widest">View History</button>
                    </div>
                    <div className="flex items-center justify-center p-20 border-2 border-dashed border-gray-50 rounded-[30px] bg-gray-50/20">
                        <span className="text-gray-300 font-bold uppercase tracking-[0.3em] text-xs">Analytics Visualization coming soon.</span>
                    </div>
                </div>

                <div className="p-10 bg-dark text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10 animate-pulse" />
                    <div className="flex flex-col gap-8 h-full relative z-10">
                        <div className="flex flex-col gap-2">
                            <span className="text-primary font-black uppercase text-[10px] tracking-[0.4em]">Premium Feature</span>
                            <h3 className="text-2xl font-black tracking-tight leading-tight">Unlock AI Product Analysis.</h3>
                        </div>
                        <p className="text-gray-400 font-medium leading-relaxed">
                            Get deeper insights into customer behavior and automated inventory predictions.
                        </p>
                        <button className="mt-auto py-4 bg-primary text-dark rounded-3xl font-black hover:bg-white transition-all transform hover:scale-[1.02]">
                            Upgrade Store
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
