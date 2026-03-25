import { Router } from 'express';
import { getCart, syncCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';
const router = Router();
// Guest-accessible (optional auth — works without login)
router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, addToCart);
// Auth-required (DB cart mutations tied to user)
router.post('/sync', requireAuth, syncCart);
router.put('/item/:itemId', requireAuth, updateCartItem);
router.delete('/item/:itemId', requireAuth, removeCartItem);
router.delete('/clear', requireAuth, clearCart);
export default router;
//# sourceMappingURL=cartRoutes.js.map