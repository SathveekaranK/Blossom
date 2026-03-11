
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const pCount = await prisma.product.count();
  const uCount = await prisma.user.count();
  console.log({ pCount, uCount });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
