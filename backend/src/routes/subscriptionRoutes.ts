import { Router } from 'express';
import {
    toggleSubscription,
    getSubscriptionStatus,
    getNotifications,
    markAsRead,
    markAllAsRead,
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/toggle', authenticate, toggleSubscription);
router.get('/status', authenticate, getSubscriptionStatus);
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markAsRead);
router.put('/notifications/read-all', authenticate, markAllAsRead);

export default router;
