
import { sendLowStockAlert, sendOrderAdminNotification } from '../src/utils/emailService.js';

async function test() {
  console.log('Testing Email Service...');
  
  // Test Low Stock Alert
  await sendLowStockAlert({
    id: 'test-id-123',
    name: 'Test Product',
    stock: 5
  });
  
  // Test Order Notification
  await sendOrderAdminNotification({
    id: 'order-test-999',
    totalAmount: 1500.50,
    createdAt: new Date(),
    shippingAddress: '123 Test St, Example City',
    user: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210'
    },
    items: [
        { product: { name: 'Vintage Pearl Clip' }, quantity: 2, price: 1250 },
        { product: { name: 'Silk Scrunchie' }, quantity: 1, price: 850 }
    ]
  });
  
  console.log('Test emails sent (check console for logs)');
}

test().catch(console.error);
