import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetStatus
} from '../controllers/budget.controller.js';
import { budgetValidator } from '../middleware/validators/budget.validator.js';

const router = express.Router();

router.route('/')
  .post(protect, budgetValidator, createBudget)
  .get(protect, getBudgets);

router.get('/status', protect, getBudgetStatus);

router.route('/:id')
  .get(protect, getBudget)
  .put(protect, budgetValidator, updateBudget)
  .delete(protect, deleteBudget);

export default router; 