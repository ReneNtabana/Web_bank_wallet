const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetStatus
} = require('../controllers/budget.controller');
const { budgetValidator } = require('../middleware/validators/budget.validator');

router.route('/')
  .post(protect, budgetValidator, createBudget)
  .get(protect, getBudgets);

router.get('/status', protect, getBudgetStatus);

router.route('/:id')
  .get(protect, getBudget)
  .put(protect, budgetValidator, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router; 