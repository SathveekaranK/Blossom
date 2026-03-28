
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { name: 'face cream' }
  });

  for (const product of products) {
    const url = product.imageUrl || '';
    console.log(`URL: ${url}`);
    
    let codes = [];
    for (let i = 0; i < url.length; i++) {
        codes.push(`${url[i]} (${url.charCodeAt(i)})`);
    }
    console.log(codes.join(', '));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
