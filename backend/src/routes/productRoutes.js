import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, toggleProductActive } from '../controllers/productController.js';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/toggle-active', toggleProductActive);
router.delete('/:id', deleteProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map