import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const res = await prisma.order.updateMany({
            where: {
                status: {
                    in: ['PENDING', 'PAID', 'CANCELLED']
                }
            },
            data: {
                status: 'ORDER'
            }
        });
        console.log(`Successfully migrated ${res.count} existing orders to 'ORDER' status.`);
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
