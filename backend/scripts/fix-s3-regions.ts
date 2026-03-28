
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all products...');
  
  const products = await prisma.product.findMany();

  console.log(`Processing ${products.length} products...`);

  let updatedCount = 0;
  for (const product of products) {
    if (product.imageUrl && (product.imageUrl.includes('ap-south-1') || product.imageUrl.indexOf('ap-south-1') !== -1)) {
      const newUrl = product.imageUrl.replace('ap-south-1', 'eu-north-1');
      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrl: newUrl }
      });
      updatedCount++;
      console.log(`Updated [${product.name}]: ${newUrl}`);
    } else {
        // Force update even if includes() falsely returns false, if we see it in the string
        if (product.imageUrl && String(product.imageUrl).indexOf('ap-south-1') !== -1) {
             const newUrl = String(product.imageUrl).replace('ap-south-1', 'eu-north-1');
             await prisma.product.update({
                where: { id: product.id },
                data: { imageUrl: newUrl }
             });
             updatedCount++;
             console.log(`Updated (forced) [${product.name}]: ${newUrl}`);
        }
    }
  }

  console.log(`SUCCESS: Updated ${updatedCount} product(s).`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
