import { Budget } from '../models/Budget.model.js';
import { Transaction } from '../models/Transaction.model.js';
import { validationResult } from 'express-validator';

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryId, amount, period, startDate, endDate, notifications } = req.body;

    const budget = await Budget.create({
      category: categoryId,
      amount,
      period,
      startDate,
      endDate,
      notifications,
      user: req.user._id
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ 
      user: req.user._id,
      endDate: { $gte: new Date() }
    })
    .populate('category', 'name type')
    .sort({ startDate: 1 });

    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get budget status
// @route   GET /api/budgets/status
// @access  Private
export const getBudgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.find({
      user: req.user._id,
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    }).populate('category', 'name type');

    const budgetStatus = await Promise.all(budgets.map(async (budget) => {
      const spending = await Transaction.aggregate([
        {
          $match: {
            user: req.user._id,
            category: budget.category._id,
            type: 'expense',
            date: {
              $gte: budget.startDate,
              $lte: budget.endDate
            }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);

      const currentSpending = spending[0]?.total || 0;
      const spendingPercentage = (currentSpending / budget.amount) * 100;

      return {
        id: budget._id,
        category: budget.category.name,
        amount: budget.amount,
        spent: currentSpending,
        remaining: budget.amount - currentSpending,
        spendingPercentage,
        period: budget.period,
        isThresholdExceeded: budget.notifications?.enabled && 
          spendingPercentage >= (budget.notifications.threshold || 80),
        threshold: budget.notifications?.threshold || 80
      };
    }));

    res.json(budgetStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
export const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('category', 'name type');

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: req.body },
      { new: true }
    ).populate('category', 'name type');

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 