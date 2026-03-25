import { prisma } from '../config/db.js';
import { z } from 'zod';
const categorySchema = z.object({
    name: z.string().min(2),
    slug: z.string().min(2),
});
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            include: { _count: { select: { products: true } } },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};
export const createCategory = async (req, res) => {
    try {
        const { name, slug } = categorySchema.parse(req.body);
        const category = await prisma.category.create({
            data: { name, slug },
        });
        res.status(201).json(category);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to create category' });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, slug } = categorySchema.parse(req.body);
        const category = await prisma.category.update({
            where: { id },
            data: { name, slug },
        });
        res.json(category);
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.issues });
        }
        res.status(500).json({ error: 'Failed to update category' });
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.category.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};
//# sourceMappingURL=categoryController.js.map