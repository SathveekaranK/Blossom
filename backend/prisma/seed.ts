import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seed: Data cleared');

    // Create Categories
    const skincare = await prisma.category.create({
        data: { name: 'Skin Care', slug: 'skin-care' },
    });

    const bodycare = await prisma.category.create({
        data: { name: 'Body Care', slug: 'body-care' },
    });

    const fragrance = await prisma.category.create({
        data: { name: 'Fragrance', slug: 'fragrance' },
    });

    console.log('Seed: Categories created');

    // Create Products
    await prisma.product.create({
        data: {
            name: 'Radiant Glow Serum',
            description: 'A powerful serum with Vitamin C and Hyaluronic Acid for a glowing skin.',
            price: 49.00,
            stock: 100,
            slug: 'radiant-glow-serum',
            categoryId: skincare.id,
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop',
        },
    });

    await prisma.product.create({
        data: {
            name: 'Smoothing Body Butter',
            description: 'Ultra-moisturizing body butter with shea butter and almond oil.',
            price: 32.00,
            stock: 50,
            slug: 'smoothing-body-butter',
            categoryId: bodycare.id,
            imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=2070&auto=format&fit=crop',
        },
    });

    await prisma.product.create({
        data: {
            name: 'Midnight Rose Parfum',
            description: 'An elegant floral fragrance with notes of rose and sandalwood.',
            price: 85.00,
            stock: 25,
            slug: 'midnight-rose-parfum',
            categoryId: fragrance.id,
            imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop',
        },
    });

    console.log('Seed: Products created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
