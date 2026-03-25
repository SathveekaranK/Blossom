import { create } from 'zustand';
import api from '../api/api';

interface WishlistItem {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    slug: string;
    category?: { name: string };
}

interface WishlistStore {
    items: WishlistItem[];
    isLoading: boolean;
    fetchWishlist: () => Promise<void>;
    toggleItem: (item: WishlistItem) => Promise<void>;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
    items: [],
    isLoading: false,

    fetchWishlist: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/wishlist');
            set({ items: res.data.products, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
            set({ isLoading: false });
        }
    },

    toggleItem: async (item) => {
        try {
            const res = await api.post('/wishlist/toggle', { productId: item.id });
            
            if (res.data.status === 'added') {
                set({ items: [...get().items, item] });
            } else {
                set({ items: get().items.filter((i) => i.id !== item.id) });
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error);
        }
    },

    isInWishlist: (id) => {
        return get().items.some((i) => i.id === id);
    },

    clearWishlist: () => {
        set({ items: [] });
    }
}));
