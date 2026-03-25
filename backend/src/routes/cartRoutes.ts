import { Router } from 'express';
import { getCart, syncCart, addToCart, updateCartItem, removeCartItem, removeCartItemByProductId, clearCart } from '../controllers/cartController.js';
import { optionalAuth, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Auth-required
router.get('/', requireAuth, getCart);
router.post('/add', requireAuth, addToCart);

// Auth-required (DB cart mutations tied to user)
router.post('/sync', requireAuth, syncCart);
router.put('/item/:itemId', requireAuth, updateCartItem);
router.delete('/item/:itemId', requireAuth, removeCartItem);
router.delete('/remove-product/:productId', requireAuth, removeCartItemByProductId);
router.delete('/clear', requireAuth, clearCart);

export default router;
