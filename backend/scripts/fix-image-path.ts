
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.updateMany({
    where: { name: 'face cream' },
    data: { 
      imageUrl: 'https://izza-collections.s3.eu-north-1.amazonaws.com/products/image-1774382075354-109741661.webp' 
    }
  });
  console.log(`Updated ${result.count} product(s) with correct S3 path.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
