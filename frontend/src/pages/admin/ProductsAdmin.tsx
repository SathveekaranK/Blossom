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
    Star,
    Image as ImageIcon,
    Tag,
    IndianRupee,
    Layers,
    Archive,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import api from '../../api/api';
import { resolveImageUrl } from '../../utils/imageUtils';

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    slug: string;
    imageUrl?: string;
    isActive: boolean;
    categoryId: string;
    rating?: number;
    category?: Category;
}

const ProductsAdmin = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        slug: '',
        categoryId: '',
        imageUrl: '',
        rating: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const fetchData = async () => {
        try {
            let url = `/products?limit=100&showInactive=true`;
            if (search) url += `&search=${search}`;
            
            const [productsRes, categoriesRes] = await Promise.all([
                api.get(url),
                api.get('/categories')
            ]);
            setProducts(productsRes.data.products);
            setCategories(categoriesRes.data);
        } catch (err) {
            console.error('Failed to fetch data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (product: Product | null = null) => {
        setEditingProduct(product);
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: Number(product.price),
                stock: product.stock,
                slug: product.slug,
                categoryId: product.categoryId,
                imageUrl: product.imageUrl || '',
                rating: product.rating || 0
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: 0,
                stock: 0,
                slug: '',
                categoryId: categories[0]?.id || '',
                imageUrl: '',
                rating: 0
            });
        }
        setImageFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const data = new FormData();
            
            // Map common fields
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', String(formData.price));
            data.append('stock', String(formData.stock));
            data.append('slug', formData.slug);
            data.append('categoryId', formData.categoryId);
            data.append('rating', String(formData.rating));
            
            // Always send isActive if editing, or let it default for new
            if (editingProduct) {
                data.append('isActive', String(editingProduct.isActive));
            }

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchData();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const handleToggleActive = async (id: string) => {
        try {
            await api.patch(`/products/${id}/toggle-active`);
            fetchData();
        } catch (err) {
            alert('Failed to toggle product status');
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-heading font-bold text-dark tracking-tight">Products</h2>
                    <p className="text-sm text-muted font-body">Manage your product inventory and listings.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-primary-dark transition-all duration-300"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-dark transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-6 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm focus:outline-none transition-all placeholder:text-muted"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-sm font-semibold text-dark bg-white px-4 py-2 rounded-xl border border-primary/10 shadow-sm">
                        Total: {products.length}
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/50 border-b border-primary/10">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Product</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Price</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted">Stock</th>
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
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <p className="text-muted font-medium text-sm">No products found.</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((prod) => (
                                    <tr key={prod.id} className="hover:bg-primary/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shadow-sm border border-primary/10 flex-shrink-0 flex items-center justify-center p-1.5">
                                                    {prod.imageUrl ? (
                                                        <img 
                                                            src={resolveImageUrl(prod.imageUrl)} 
                                                            alt={prod.name} 
                                                            className="w-full h-full object-contain mix-blend-multiply" 
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-gray-300" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-semibold text-dark text-sm line-clamp-1">{prod.name}</span>
                                                    <span className="text-xs font-medium text-muted">/{prod.slug}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-dark bg-light px-2.5 py-1 rounded-full">{prod.category?.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-dark">
                                                ₹{Number(prod.price).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-xs font-bold px-2.5 py-1 rounded-full w-fit ${prod.stock > 10 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {prod.stock} in stock
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(prod.id)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${prod.isActive ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-light text-muted border-primary/10 hover:bg-white/15'}`}
                                            >
                                                {prod.isActive ? <ToggleRight className="w-4 h-4 text-green-600" /> : <ToggleLeft className="w-4 h-4" />}
                                                {prod.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(prod)}
                                                    className="p-2 rounded-lg hover:bg-light text-dark transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(prod.id)}
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

            {/* Product Modal */}
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
                            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden overflow-y-auto max-h-[90vh] custom-scrollbar border border-primary/10"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary/10">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-heading font-bold text-dark tracking-tight">
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </h3>
                                    <p className="text-xs font-semibold text-muted uppercase tracking-wider">Product Details</p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 bg-white rounded-full hover:bg-light transition-colors border border-primary/10"
                                >
                                    <X className="w-5 h-5 text-dark" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <Tag className="w-3.5 h-3.5 text-muted" /> Product Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                name: val,
                                                slug: editingProduct ? prev.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                                            }));
                                        }}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none placeholder:text-muted"
                                        placeholder="e.g. Classic White T-Shirt"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <Archive className="w-3.5 h-3.5 text-muted" /> Description
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none min-h-[120px] resize-none placeholder:text-muted"
                                        placeholder="Enter product description..."
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <IndianRupee className="w-3.5 h-3.5 text-muted" /> Price
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark">Initial Stock</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <Star className="w-3.5 h-3.5 text-muted" /> Rating
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        required
                                        value={formData.rating}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <Layers className="w-3.5 h-3.5 text-muted" /> Category
                                    </label>
                                    <select
                                        required
                                        value={formData.categoryId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-dark flex items-center gap-2">
                                        <ImageIcon className="w-3.5 h-3.5 text-muted" /> Product Image
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                            id="product-image"
                                        />
                                        <label
                                            htmlFor="product-image"
                                            className="flex-1 flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-dashed border-primary/10 hover:border-dark hover:bg-light cursor-pointer transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-muted group-hover:text-dark transition-colors">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <div className="flex flex-col text-left">
                                                <span className="text-sm font-bold text-dark">
                                                    {imageFile ? imageFile.name : 'Upload File'}
                                                </span>
                                                <span className="text-xs font-medium text-muted">
                                                    JPG, PNG (MAX 5MB)
                                                </span>
                                            </div>
                                        </label>
                                        {!imageFile && formData.imageUrl && (
                                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-primary/10">
                                                <div className="w-12 h-12 bg-white rounded-xl p-1 border border-primary/10 shadow-sm flex items-center justify-center">
                                                    <img 
                                                        src={resolveImageUrl(formData.imageUrl)} 
                                                        className="w-full h-full object-contain mix-blend-multiply" 
                                                        alt="current" 
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-muted">Current</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-xs font-bold text-dark">URL Slug (SEO)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }))}
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-primary/10 focus:border-dark focus:ring-1 focus:ring-dark text-dark text-sm transition-all outline-none"
                                        placeholder="classic-white-tshirt"
                                    />
                                </div>

                                {error && (
                                    <div className="md:col-span-2 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm font-semibold">{error}</span>
                                    </div>
                                )}

                                <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t border-primary/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-6 py-3 rounded-xl font-semibold text-sm text-dark bg-white border border-primary/10 hover:bg-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-dark text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-primary-dark disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center min-w-[140px]"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingProduct ? 'Save Changes' : 'Create Product')}
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

export default ProductsAdmin;
