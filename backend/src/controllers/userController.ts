import type { Request, Response } from 'express';
import { prisma } from '../index.js';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isSubscribed: true,
                createdAt: true,
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isSubscribed: true,
                createdAt: true,
                orders: {
                    include: { items: { include: { product: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
