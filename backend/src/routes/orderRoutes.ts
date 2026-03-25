import { Router } from 'express';
import {
    getAllOrders,
    updateOrderStatus,
    getMyOrders,
    getOrderById,
    createCheckoutSession,
    stripeWebhook,
    getDashboardStats,
} from '../controllers/orderController.js';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';

const router = Router();

export const stripeWebhookRoute = stripeWebhook;

// Customer routes — strict auth
router.get('/my-orders', requireAuth, getMyOrders);
router.get('/my-orders/:id', requireAuth, getOrderById);
router.post('/checkout', requireAuth, createCheckoutSession);

// Admin routes — bypass auth entirely
router.get('/', getAllOrders);
router.get('/dashboard-stats', getDashboardStats);
router.put('/:id/status', updateOrderStatus);

export default router;
