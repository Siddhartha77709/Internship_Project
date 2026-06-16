import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview
} from '../controllers/productController.js';
import { requireAuth, requireSeller, requireCustomer } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', requireSeller, createProduct);
router.put('/:id', requireSeller, updateProduct);
router.delete('/:id', requireSeller, deleteProduct);
router.post('/:id/reviews', requireCustomer, createProductReview);

export default router;
