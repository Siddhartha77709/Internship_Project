import express from 'express';
import { buyStock, sellStock, getTradeHistory } from '../controllers/transactionController.js';
import { requireUser, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// requireUser enforces role === 'USER' — admins cannot trade via API
router.post('/buy', requireUser, buyStock);
router.post('/sell', requireUser, sellStock);
router.get('/history', requireAuth, getTradeHistory);

export default router;
