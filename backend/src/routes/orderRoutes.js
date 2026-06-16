import express from 'express';
import {
  createOrder,
  getCustomerOrders,
  getSellerOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { requireAuth, requireSeller, requireCustomer } from '../middleware/auth.js';

const router = express.Router();

router.post('/', requireCustomer, createOrder);
router.get('/customer', requireCustomer, getCustomerOrders);
router.get('/seller', requireSeller, getSellerOrders);
router.put('/:id/status', requireSeller, updateOrderStatus);

export default router;
