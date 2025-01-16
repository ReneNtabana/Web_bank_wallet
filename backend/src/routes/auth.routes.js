import express from 'express';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { registerValidator, loginValidator } from '../middleware/validators/auth.validator.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/profile', protect, getProfile);

export default router; 