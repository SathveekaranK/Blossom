import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/api';
import { useAuthStore } from './useAuthStore';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    slug: string;
    stock?: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: any, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    clearLocalCart: () => void;
    fetchCartFromDB: () => Promise<void>;
    setItems: (items: CartItem[]) => void;
    total: number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            addItem: async (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                let newItems;
                if (existingItem) {
                    newItems = items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    newItems = [...items, {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        imageUrl: product.imageUrl,
                        slug: product.slug,
                        stock: product.stock,
                        quantity
                    }];
                }

                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items: newItems, total });

                if (useAuthStore.getState().isAuthenticated) {
                    try {
                        await api.post('/cart/add', { productId: product.id, quantity });
                    } catch (e) { console.error('Failed to sync add item', e); }
                }
            },
            removeItem: async (id) => {
                const newItems = get().items.filter((item) => item.id !== id);
                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items: newItems, total });

                if (useAuthStore.getState().isAuthenticated) {
                    try {
                        await api.delete(`/cart/remove-product/${id}`);
                    } catch (e) { console.error('Failed to sync remove item', e); }
                }
            },
            updateQuantity: async (id, quantity) => {
                const newItems = get().items.map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                );
                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items: newItems, total });

                if (useAuthStore.getState().isAuthenticated) {
                    try {
                        const currentItems = newItems.map(i => ({ productId: i.id, quantity: i.quantity }));
                        await api.post('/cart/sync', { items: currentItems });
                    } catch (e) { console.error('Failed to sync update quantity', e); }
                }
            },
            clearCart: async () => {
                set({ items: [], total: 0 });
                if (useAuthStore.getState().isAuthenticated) {
                    try {
                        await api.delete('/cart/clear');
                    } catch (e) { console.error('Failed to clear cart database', e); }
                }
            },
            clearLocalCart: () => {
                set({ items: [], total: 0 });
            },
            fetchCartFromDB: async () => {
                if (!useAuthStore.getState().isAuthenticated) return;
                try {
                    const res = await api.get('/cart');
                    const dbCart = res.data;
                    if (dbCart && dbCart.items) {
                        const formattedItems = dbCart.items.map((ci: any) => ({
                            id: ci.product.id,
                            name: ci.product.name,
                            price: ci.product.price,
                            imageUrl: ci.product.imageUrl,
                            slug: ci.product.slug,
                            stock: ci.product.stock,
                            quantity: ci.quantity
                        }));
                        const total = formattedItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
                        set({ items: formattedItems, total });
                    }
                } catch (e) {
                    console.error('Failed to fetch cart from database', e);
                }
            },
            setItems: (items) => {
                const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items, total });
            },
        }),
        {
            name: 'blossom-cart',
        }
    )
);
