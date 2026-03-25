import { Router } from 'express';
import { getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct, toggleProductActive } from '../controllers/productController.js';
import { requireAuth, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../config/multer.js';

const router = Router();

router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/id/:id', getProductById);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.patch('/:id/toggle-active', toggleProductActive);
router.delete('/:id', deleteProduct);

export default router;
