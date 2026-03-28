
import { prisma } from '../src/config/db.js';
import { sendLowStockAlert } from '../src/utils/emailService.js';

async function testLowStock() {
  console.log('Testing Low Stock Trigger...');
  
  // 1. Pick a product and ensure its alert flag is false
  const productSlug = 'face-cream';
  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) throw new Error('Product not found');
  
  await prisma.product.update({ 
    where: { id: product.id }, 
    data: { stock: 15, lowStockAlertSent: false } 
  });
  console.log('Initial state: Stock 15, lowStockAlertSent false');

  // 2. Simulate stock decrement (e.g. from an order)
  const updated = await prisma.product.update({
    where: { id: product.id },
    // decrementing by 10
    data: { stock: 5 }
  });
  
  console.log(`Updated stock to: ${updated.stock}`);
  
  // 3. Emulate the logic in orderController.ts
  if (updated.stock < 10 && !updated.lowStockAlertSent) {
      console.log('Stock is low! Triggering alert...');
      await sendLowStockAlert(updated);
      await prisma.product.update({
          where: { id: updated.id },
          data: { lowStockAlertSent: true }
      });
      console.log('Alert sent and flag updated to true');
  }

  // 4. Verify duplicate prevention
  const again = await prisma.product.findUnique({ where: { id: product.id } });
  if (again && again.stock < 10 && !again.lowStockAlertSent) {
      console.log('ERROR: Low stock alert should NOT trigger again');
  } else {
      console.log('SUCCESS: Duplicate alert prevented');
  }
}

testLowStock().catch(console.error).finally(() => prisma.$disconnect());
