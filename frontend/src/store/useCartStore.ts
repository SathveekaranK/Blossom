import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    slug: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: any, quantity?: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            addItem: (product, quantity = 1) => {
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
                    newItems = [...items, { ...product, quantity }];
                }

                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items: newItems, total });
            },
            removeItem: (id) => {
                const newItems = get().items.filter((item) => item.id !== id);
                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items: newItems, total });
            },
            updateQuantity: (id, quantity) => {
                const newItems = get().items.map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
                );
                const total = newItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                set({ items: newItems, total });
            },
            clearCart: () => set({ items: [], total: 0 }),
        }),
        {
            name: 'blossom-cart',
        }
    )
);
