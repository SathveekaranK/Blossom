import { Router } from 'express';
import { register, login, getMe, logout, checkoutLogin } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/checkout-login', checkoutLogin);
router.get('/me', requireAuth, getMe);
export default router;
//# sourceMappingURL=authRoutes.js.map