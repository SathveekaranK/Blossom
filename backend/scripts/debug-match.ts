
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: { name: 'face cream' }
  });

  for (const product of products) {
    const url = product.imageUrl || '';
    console.log(`URL: ${url}`);
    console.log(`Includes 'ap-south-1': ${url.includes('ap-south-1')}`);
    console.log(`Includes 'ap-south': ${url.includes('ap-south')}`);
    console.log(`Includes 'south-1': ${url.includes('south-1')}`);
    
    // Let's try to update specifically this one with a simple replace
    if (url.includes('ap-south-1')) {
        console.log('Replacing...');
    } else {
        console.log('Not replacing. Checking for partial matches...');
        for (let i = 0; i < url.length - 10; i++) {
            if (url.substring(i, i+10).includes('ap-south')) {
                console.log(`Found partial 'ap-south' at index ${i}: ${url.substring(i, i+15)}`);
            }
        }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
