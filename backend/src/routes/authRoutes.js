import express from 'express';
import { registerUser, loginUser, verifyToken } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify', requireAuth, verifyToken);

export default router;
