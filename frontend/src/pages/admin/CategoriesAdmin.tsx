import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import api from '../../api/api';

interface Category {
    id: string;
    name: string;
    slug: string;
    imageUrl?: string;
    _count?: {
        products: number;
    };
}

const CategoriesAdmin = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to fetch categories');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setName(category ? category.name : '');
        setSlug(category ? category.slug : '');
        setImageUrl(category?.imageUrl || '');
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, { name, slug, imageUrl });
            } else {
                await api.post('/categories', { name, slug, imageUrl });
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            fetchCategories();
        } catch (err) {
            alert('Delete failed');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-dark tracking-tight">Product Categories</h2>
                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Organize your inventory</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-dark text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-black/10 hover:bg-primary transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Category</span>
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[40px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <div className="relative w-96 group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-14 pr-6 py-3.5 bg-gray-50/50 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl text-sm font-medium focus:outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Total: {categories.length}</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[250px]">Category Name</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[150px]">Slug Identifier</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 min-w-[120px]">Products</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right min-w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">No categories found.</p>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-dark font-black">
                                                    {cat.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-dark">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <code className="text-xs font-bold bg-primary/5 text-primary px-3 py-1 rounded-lg">/{cat.slug}</code>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-dark/70 bg-gray-100/50 px-3 py-1 rounded-full">{cat._count?.products || 0} items</span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(cat)}
                                                    className="p-2.5 rounded-xl hover:bg-white hover:shadow-md text-gray-400 hover:text-dark transition-all"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2.5 rounded-xl hover:bg-red-50 hover:shadow-sm text-gray-400 hover:text-red-500 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/20 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 overflow-hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black text-dark tracking-tight">
                                        {editingCategory ? 'Edit Category' : 'New Category'}
                                    </h3>
                                    <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Metadata Configuration</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Display Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                        }}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                        placeholder="e.g. Luxury Skincare"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">URL Slug</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">/</span>
                                        <input
                                            type="text"
                                            required
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                            className="w-full pl-10 pr-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                            placeholder="luxury-skincare"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-dark/40 ml-4 uppercase tracking-[0.2em]">Image URL</label>
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-3xl text-sm font-medium focus:outline-none transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500">
                                        <AlertCircle className="w-5 h-5" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{error}</span>
                                    </div>
                                )}

                                <button
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-dark text-white rounded-3xl font-black hover:bg-primary transition-all duration-300 shadow-xl shadow-black/10 flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : editingCategory ? 'Update Changes' : 'Create Category'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoriesAdmin;
