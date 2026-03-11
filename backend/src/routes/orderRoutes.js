import { Router } from 'express';
import express from 'express';
import { getAllOrders, updateOrderStatus, getMyOrders, getOrderById, createCheckoutSession, stripeWebhook, getDashboardStats, } from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = Router();
export const stripeWebhookRoute = stripeWebhook;
// Customer routes
router.get('/my-orders', authenticate, getMyOrders);
router.get('/my-orders/:id', authenticate, getOrderById);
router.post('/checkout', authenticate, createCheckoutSession);
// Admin routes
router.get('/', authenticate, authorize(['ADMIN']), getAllOrders);
router.get('/dashboard-stats', authenticate, authorize(['ADMIN']), getDashboardStats);
router.put('/:id/status', authenticate, authorize(['ADMIN']), updateOrderStatus);
export default router;
//# sourceMappingURL=orderRoutes.js.map