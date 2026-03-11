
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log('No users found in DB.');
    return;
  }
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' }
    });
    console.log(`User ${user.email} promoted to ADMIN.`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
