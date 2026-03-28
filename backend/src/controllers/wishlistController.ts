import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const toggleWishlist = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Check if item already exists
        const existing = await prisma.wishlist.findFirst({
            where: {
                userId,
                productId,
                product: { isDeleted: false }
            }
        });

        if (existing) {
            // Remove (unlike)
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            return res.json({ status: 'removed', message: 'Product removed from wishlist' });
        } else {
            // Add (like)
            await prisma.wishlist.create({
                data: {
                    userId,
                    productId
                }
            });
            return res.json({ status: 'added', message: 'Product added to wishlist' });
        }
    } catch (error) {
        console.error('Wishlist Toggle Error:', error);
        res.status(500).json({ error: 'Failed to toggle wishlist' });
    }
};

export const getWishlist = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;

        const wishlist = await prisma.wishlist.findMany({
            where: { 
                userId,
                product: { isDeleted: false }
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            }
        });

        // Extract products for easier frontend consumption
        const products = wishlist.map(item => item.product);

        res.json({ products });
    } catch (error) {
        console.error('Fetch Wishlist Error:', error);
        res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
};
