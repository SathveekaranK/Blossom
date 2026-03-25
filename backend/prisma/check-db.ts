import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const orderCount = await prisma.order.count();
    const categoryCount = await prisma.category.count();

    console.log('--- DATABASE STATUS ---');
    console.log('Users:', userCount);
    console.log('Products:', productCount);
    console.log('Orders:', orderCount);
    console.log('Categories:', categoryCount);
    console.log('-----------------------');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
