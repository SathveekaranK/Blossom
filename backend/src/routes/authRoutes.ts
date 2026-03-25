import { Router } from 'express';
import { register, login, getMe, logout, checkoutLogin, verifyEmailOtp, resendEmailOtp } from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/checkout-login', checkoutLogin);
router.post('/verify-otp', verifyEmailOtp);
router.post('/resend-otp', resendEmailOtp);
router.get('/me', requireAuth, getMe);

export default router;
