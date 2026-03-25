import { Router } from 'express';
import { getAllUsers, getUserById } from '../controllers/userController.js';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', getAllUsers);
router.get('/:id', getUserById);
export default router;
//# sourceMappingURL=userRoutes.js.map