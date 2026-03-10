import { Router } from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), getAllOrders);
router.put('/:id/status', authenticate, authorize(['ADMIN']), updateOrderStatus);

export default router;
