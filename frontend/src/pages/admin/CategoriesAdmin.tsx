import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Trash2,
    Edit3,
    X,
    Loader2,
    AlertCircle,
    Layers,
    Tag,
    Image as ImageIcon
} from 'lucide-react';
import api from '../../api/api';
import { resolveImageUrl } from '../../utils/imageUtils';

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
    const [search, setSearch] = useState('');

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

    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(search.toLowerCase()) || 
        cat.slug.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">Categories</h2>
                    <p className="text-sm text-muted font-body">Organize your inventory and store navigation.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-black transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-dark transition-colors" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm focus:outline-none transition-all placeholder:text-muted"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-dark bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                        Total: {filteredCategories.length}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Slug</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Products</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-dark mx-auto" />
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <p className="text-muted font-medium text-sm">No categories found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex-shrink-0 flex items-center justify-center p-1.5 font-heading text-xl font-bold text-dark">
                                                    {cat.imageUrl ? (
                                                        <img src={resolveImageUrl(cat.imageUrl)} alt={cat.name} className="w-full h-full object-contain mix-blend-multiply" />
                                                    ) : (
                                                        cat.name.charAt(0)
                                                    )}
                                                </div>
                                                <span className="font-semibold text-dark text-sm">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs font-semibold bg-gray-100 text-dark px-2.5 py-1 rounded-md border border-gray-200">/{cat.slug}</code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-dark bg-gray-100 px-3 py-1 rounded-full">{cat._count?.products || 0} items</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(cat)}
                                                    className="p-2 rounded-lg hover:bg-gray-100 text-dark transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                                    title="Delete"
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
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-dark/40 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-heading font-bold text-dark tracking-tight">
                                        {editingCategory ? 'Edit Category' : 'New Category'}
                                    </h3>
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Configuration</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <X className="w-5 h-5 text-dark" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <Layers className="w-3.5 h-3.5 text-muted" /> Display Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (!editingCategory) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                                        }}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                        placeholder="e.g. New Arrivals"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 text-muted" /> URL Slug
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-bold text-sm">/</span>
                                        <input
                                            type="text"
                                            required
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))}
                                            className="w-full pl-8 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                            placeholder="new-arrivals"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <ImageIcon className="w-3.5 h-3.5 text-muted" /> Image URL (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                        placeholder="https://..."
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm font-semibold">{error}</span>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-semibold text-sm text-dark bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-dark text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-black disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[140px]"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingCategory ? 'Save Changes' : 'Create Category')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CategoriesAdmin;
