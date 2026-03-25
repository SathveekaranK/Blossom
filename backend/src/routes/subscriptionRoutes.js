import { Router } from 'express';
import { toggleSubscription, getSubscriptionStatus, getNotifications, markAsRead, markAllAsRead, } from '../controllers/subscriptionController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/toggle', requireAuth, toggleSubscription);
router.get('/status', requireAuth, getSubscriptionStatus);
router.get('/notifications', requireAuth, getNotifications);
router.put('/notifications/:id/read', requireAuth, markAsRead);
router.put('/notifications/read-all', requireAuth, markAllAsRead);
export default router;
//# sourceMappingURL=subscriptionRoutes.js.map