import express from 'express';
import { getSellerAnalytics } from '../controllers/analyticsController.js';
import { requireSeller } from '../middleware/auth.js';

const router = express.Router();

router.get('/seller', requireSeller, getSellerAnalytics);

export default router;
