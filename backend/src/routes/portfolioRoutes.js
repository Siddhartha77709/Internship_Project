import express from 'express';
import { getPortfolio } from '../controllers/portfolioController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getPortfolio);

export default router;
