import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting total database purge...');

    // Order of deletion matters due to foreign key constraints
    try {
        console.log('Clearing OrderItems...');
        await prisma.orderItem.deleteMany();

        console.log('Clearing Orders...');
        await prisma.order.deleteMany();

        console.log('Clearing CartItems...');
        await prisma.cartItem.deleteMany();

        console.log('Clearing Carts...');
        await prisma.cart.deleteMany();

        console.log('Clearing Wishlist...');
        await prisma.wishlist.deleteMany();

        console.log('Clearing Notifications...');
        await prisma.notification.deleteMany();

        console.log('Clearing Products...');
        await prisma.product.deleteMany();

        console.log('Clearing Categories...');
        await prisma.category.deleteMany();

        console.log('Clearing Users...');
        await prisma.user.deleteMany();

        console.log('Purge complete! Database is now empty.');
    } catch (error) {
        console.error('Error during purge:', error);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
