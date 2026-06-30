import express from 'express';
import { getAllStocks, getStockById, createStock, updateStock, deleteStock } from '../controllers/stockController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllStocks);
router.get('/:id', getStockById);
router.post('/', requireAdmin, createStock);
router.put('/:id', requireAdmin, updateStock);
router.delete('/:id', requireAdmin, deleteStock);

export default router;
