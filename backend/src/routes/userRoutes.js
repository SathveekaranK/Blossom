import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', authenticate, authorize(['ADMIN']), getAllUsers);
router.get('/:id', authenticate, authorize(['ADMIN']), getUserById);
export default router;
//# sourceMappingURL=userRoutes.js.map