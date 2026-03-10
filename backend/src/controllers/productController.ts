import type { Request, Response } from 'express';
import { prisma } from '../index.js';
import { z } from 'zod';

const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    slug: z.string().min(2),
    categoryId: z.string().uuid(),
    imageUrl: z.string().url().optional(),
});

export const getProducts = async (req: Request, res: Response) => {
    try {
        const { category, search, sort, limit = 10, page = 1 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: any = {};
        if (category) where.category = { slug: String(category) };
        if (search) where.name = { contains: String(search) };

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
        const { slug } = req.params;
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

export const createProduct = async (req: Request, res: Response) => {
    try {
        const validatedData = productSchema.parse(req.body);
        const product = await prisma.product.create({
            data: validatedData,
        });
        res.status(201).json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const validatedData = productSchema.parse(req.body);
        const product = await prisma.product.update({
            where: { id },
            data: validatedData,
        });
        res.json(product);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
