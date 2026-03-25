import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';

// Get the logged-in user's cart
export const getCart = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        let cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: { include: { category: true } } },
                },
            },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: { product: { include: { category: true } } },
                    },
                },
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
};

// Sync local cart items with DB (merge on login)
export const syncCart = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { items } = req.body; // [{ productId, quantity }]

        // Find or create user cart
        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        // For each local item, upsert into DB cart
        for (const item of items) {
            // Validate product exists and has stock
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
            });
            if (!product || !product.isActive) continue;

            const existingItem = await prisma.cartItem.findFirst({
                where: { cartId: cart.id, productId: item.productId },
            });

            const finalQty = existingItem
                ? existingItem.quantity + item.quantity
                : item.quantity;

            // Cap at available stock
            const cappedQty = Math.min(finalQty, product.stock);

            if (existingItem) {
                await prisma.cartItem.update({
                    where: { id: existingItem.id },
                    data: { quantity: cappedQty },
                });
            } else {
                await prisma.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId: item.productId,
                        quantity: cappedQty,
                    },
                });
            }
        }

        // Return updated cart
        const updatedCart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: { include: { category: true } } },
                },
            },
        });

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to sync cart' });
    }
};

// Add item to cart
export const addToCart = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity = 1 } = req.body;

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product || !product.isActive) {
            return res.status(400).json({ error: 'Product not available' });
        }

        let cart = await prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma.cart.create({ data: { userId } });
        }

        const existingItem = await prisma.cartItem.findFirst({
            where: { cartId: cart.id, productId },
        });

        if (existingItem) {
            const newQty = Math.min(existingItem.quantity + quantity, product.stock);
            await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQty },
            });
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity: Math.min(quantity, product.stock),
                },
            });
        }

        const updatedCart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: { include: { category: true } } },
                },
            },
        });

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

// Update cart item quantity
export const updateCartItem = async (req: any, res: Response) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: { product: true },
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        const cappedQty = Math.min(Math.max(1, quantity), cartItem.product.stock);

        await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: cappedQty },
        });

        res.json({ message: 'Updated', quantity: cappedQty });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart item' });
    }
};

// Remove item from cart
export const removeCartItem = async (req: any, res: Response) => {
    try {
        const { itemId } = req.params;
        await prisma.cartItem.delete({ where: { id: itemId } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
};

// Remove item from cart by product ID
export const removeCartItemByProductId = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params;
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id, productId } });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove product from cart' });
    }
};

// Clear entire cart
export const clearCart = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
            await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear cart' });
    }
};
