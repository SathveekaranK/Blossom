
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const id = '97706ffa-6021-4cac-846a-7289f6498ec5';
  const newUrl = 'https://izza-collections.s3.eu-north-1.amazonaws.com/1774382075354-109741661.webp';
  
  const updated = await prisma.product.update({
    where: { id },
    data: { imageUrl: newUrl }
  });
  
  console.log(`Updated successfully: ${updated.name} -> ${updated.imageUrl}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
