import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, toggleProductActive } from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', authenticate, authorize(['ADMIN']), createProduct);
router.put('/:id', authenticate, authorize(['ADMIN']), updateProduct);
router.patch('/:id/toggle-active', authenticate, authorize(['ADMIN']), toggleProductActive);
router.delete('/:id', authenticate, authorize(['ADMIN']), deleteProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map