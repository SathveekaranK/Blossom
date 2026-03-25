import { prisma } from '../config/db.js';
import { z } from 'zod';
import { notifySubscribers } from './subscriptionController.js';
const productSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    slug: z.string().min(2),
    categoryId: z.string().uuid(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().optional(),
});
export const getProducts = async (req, res) => {
    try {
        const { category, search, sort, limit = 10, page = 1, showInactive } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (category)
            where.category = { slug: String(category) };
        if (search)
            where.name = { contains: String(search) };
        // Only show active products to customers — admin can see all
        if (showInactive !== 'true')
            where.isActive = true;
        const orderBy = {};
        if (sort === 'price_asc')
            orderBy.price = 'asc';
        else if (sort === 'price_desc')
            orderBy.price = 'desc';
        else
            orderBy.createdAt = 'desc';
        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: Number(limit),
            skip,
            include: { category: true },
        });
        const total = await prisma.product.count({ where });
        res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
export const getProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await prisma.product.findUnique({
            where: { slug },
            include: { category: true },
        });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};
export const createProduct = async (req, res) => {
    try {
        const validatedData = productSchema.parse(req.body);
        const product = await prisma.product.create({
            data: {
                ...validatedData,
                imageUrl: validatedData.imageUrl ?? null,
            },
        });
        // Notify all subscribers about the new product
        await notifySubscribers({
            id: product.id,
            name: product.name,
            price: product.price,
        });
        res.status(201).json(product);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to create product' });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const validatedData = productSchema.parse(req.body);
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...validatedData,
                imageUrl: validatedData.imageUrl ?? null,
            },
        });
        res.json(product);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to update product' });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.product.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
// Toggle product visibility
export const toggleProductActive = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product)
            return res.status(404).json({ error: 'Product not found' });
        const updated = await prisma.product.update({
            where: { id },
            data: { isActive: !product.isActive },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to toggle product status' });
    }
};
//# sourceMappingURL=productController.js.map