import 'dotenv/config';
import { prisma } from '../src/config/db.js';
import bcrypt from 'bcrypt';
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
    // Create Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@blossom.com',
            name: 'Blossom Admin',
            password: passwordHash,
            role: 'ADMIN',
        }
    });
    const customer = await prisma.user.create({
        data: {
            email: 'customer@blossom.com',
            name: 'Test Customer',
            password: passwordHash,
            role: 'CUSTOMER',
        }
    });
    console.log('Seed: Users created');
    console.log('      Admin: admin@blossom.com / password123');
    console.log('      Customer: customer@blossom.com / password123');
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
    const makeup = await prisma.category.create({
        data: { name: 'Make Up', slug: 'makeup' },
    });
    console.log('Seed: Categories created');
    // Create Products
    await prisma.product.create({
        data: {
            name: 'Radiant Glow Serum',
            description: 'A powerful serum with Vitamin C and Hyaluronic Acid for a glowing skin. Deeply hydrates and naturally brightens.',
            price: 49.00,
            stock: 100,
            slug: 'radiant-glow-serum',
            categoryId: skincare.id,
            imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1974&auto=format&fit=crop',
        },
    });
    await prisma.product.create({
        data: {
            name: 'Purifying Clay Mask',
            description: 'Deep cleansing green clay mask that minimizes pores, removes impurities, and absorbs excess oil.',
            price: 28.50,
            stock: 75,
            slug: 'purifying-clay-mask',
            categoryId: skincare.id,
            imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1974&auto=format&fit=crop',
        },
    });
    await prisma.product.create({
        data: {
            name: 'Smoothing Body Butter',
            description: 'Ultra-moisturizing body butter with shea butter and almond oil for silky skin all day long.',
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
            description: 'An elegant floral fragrance with top notes of bergamot, a heart of rose, and a sandalwood base.',
            price: 85.00,
            stock: 25,
            slug: 'midnight-rose-parfum',
            categoryId: fragrance.id,
            imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1920&auto=format&fit=crop',
        },
    });
    await prisma.product.create({
        data: {
            name: 'Velvet Matte Lipstick',
            description: 'Long-lasting, highly pigmented red lipstick that creates a flawless velvet finish without drying your lips.',
            price: 24.00,
            stock: 120,
            slug: 'velvet-matte-lipstick',
            categoryId: makeup.id,
            imageUrl: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1926&auto=format&fit=crop',
        },
    });
    console.log('Seed: Products created');
    console.log('Seed: Done!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map