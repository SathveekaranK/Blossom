import { Router } from 'express';
import { getCart, syncCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getCart);
router.post('/sync', authenticate, syncCart);
router.post('/add', authenticate, addToCart);
router.put('/item/:itemId', authenticate, updateCartItem);
router.delete('/item/:itemId', authenticate, removeCartItem);
router.delete('/clear', authenticate, clearCart);

export default router;
