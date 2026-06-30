import express from 'express';
import { getAdminStats, getAllUsers, getAllTransactions } from '../controllers/adminController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', requireAdmin, getAdminStats);
router.get('/users', requireAdmin, getAllUsers);
router.get('/transactions', requireAdmin, getAllTransactions);

export default router;
