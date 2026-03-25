import type { Request, Response } from 'express';
import { prisma } from '../config/db.js';
import { z } from 'zod';
import { notifySubscribers } from './subscriptionController.js';

const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().nonnegative(),
    slug: z.string().min(2),
    categoryId: z.string().uuid(),
    imageUrl: z.string().optional(),
    rating: z.coerce.number().min(0).max(5).default(0).optional(),
    isActive: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
});

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, sort, limit = 10, page = 1, showInactive, maxPrice, minPrice } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};
        
        // Category filtering
        if (category) where.category = { slug: String(category) };
        
        // Search filtering (name or description)
        if (search) {
            where.OR = [
                { name: { contains: String(search) } },
                { description: { contains: String(search) } },
            ];
        }

        // Price filtering
        if (maxPrice || minPrice) {
            where.price = {};
            if (maxPrice) where.price.lte = Number(maxPrice);
            if (minPrice) where.price.gte = Number(minPrice);
        }

        // Only show active products to customers — admin can see all
        if (showInactive !== 'true') {
            where.isActive = true;
            // Optionally: only show products in stock to customers? 
            // The user didn't explicitly ask for this in filtered results, but it's common.
            // I'll stick to what they asked: "show Out of Stock" in UI, but keep them in list.
        }

        const orderBy: any = {};
        if (sort === 'price_asc') orderBy.price = 'asc';
        else if (sort === 'price_desc') orderBy.price = 'desc';
        else orderBy.createdAt = 'desc';

        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: Number(limit),
            skip,
            include: { category: true },
        });

        const total = await prisma.product.count({ where });

        res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getProductBySlug = async (req: Request, res: Response) => {
    try {
        const slug = req.params.slug as string;
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { category: true },
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const validatedData = productSchema.parse(req.body);
        
        let imageUrl = validatedData.imageUrl || null;
        if (req.file) {
            // @ts-ignore - location is added by multer-s3
            imageUrl = req.file.location || `/uploads/${req.file.filename}`;
        }

        const product = await prisma.product.create({
            data: {
                ...validatedData,
                imageUrl,
            },
        });

        // Notify all subscribers about the new product
        await notifySubscribers({
            id: product.id,
            name: product.name,
            price: product.price,
        });

        res.status(201).json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMsg = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return res.status(400).json({ error: errorMsg });
        }
        console.error('Create Product Error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const validatedData = productSchema.parse(req.body);

        let imageUrl = validatedData.imageUrl;
        if (req.file) {
            // @ts-ignore - location is added by multer-s3
            imageUrl = req.file.location || `/uploads/${req.file.filename}`;
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...validatedData,
                imageUrl: imageUrl ?? undefined,
            },
        });
        res.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMsg = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return res.status(400).json({ error: errorMsg });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

// Toggle product visibility
export const toggleProductActive = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return res.status(404).json({ error: 'Product not found' });

        const updated = await prisma.product.update({
            where: { id },
            data: { isActive: !product.isActive },
        });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle product status' });
    }
};
