const { Budget, Category, Transaction } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
const createBudget = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryId, amount, period, startDate, endDate, notifications } = req.body;

    const budget = await Budget.create({
      userId: req.user.id,
      categoryId,
      amount,
      period,
      startDate,
      endDate,
      notifications
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all budgets for user
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      where: { 
        userId: req.user.id,
        endDate: {
          [Op.gte]: new Date()
        }
      },
      include: [{
        model: Category,
        attributes: ['name', 'type']
      }],
      order: [['startDate', 'ASC']]
    });

    // Calculate current spending for each budget
    for (let budget of budgets) {
      const spending = await Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          categoryId: budget.categoryId,
          type: 'expense',
          date: {
            [Op.between]: [budget.startDate, budget.endDate]
          }
        }
      });

      budget.currentSpending = spending || 0;
      await budget.save();
    }

    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Category,
        attributes: ['name', 'type']
      }]
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Calculate current spending
    const spending = await Transaction.sum('amount', {
      where: {
        userId: req.user.id,
        categoryId: budget.categoryId,
        type: 'expense',
        date: {
          [Op.between]: [budget.startDate, budget.endDate]
        }
      }
    });

    budget.currentSpending = spending || 0;
    await budget.save();

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    const { amount, period, startDate, endDate, notifications, isActive } = req.body;
    
    await budget.update({
      amount: amount || budget.amount,
      period: period || budget.period,
      startDate: startDate || budget.startDate,
      endDate: endDate || budget.endDate,
      notifications: notifications || budget.notifications,
      isActive: isActive !== undefined ? isActive : budget.isActive
    });

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await budget.destroy();
    res.json({ message: 'Budget removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get budget status and notifications
// @route   GET /api/budgets/status
// @access  Private
const getBudgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      where: { 
        userId: req.user.id,
        isActive: true,
        endDate: {
          [Op.gte]: new Date()
        }
      },
      include: [{
        model: Category,
        attributes: ['name', 'type']
      }]
    });

    const budgetStatus = await Promise.all(budgets.map(async (budget) => {
      const spending = await Transaction.sum('amount', {
        where: {
          userId: req.user.id,
          categoryId: budget.categoryId,
          type: 'expense',
          date: {
            [Op.between]: [budget.startDate, budget.endDate]
          }
        }
      }) || 0;

      const spendingPercentage = (spending / budget.amount) * 100;
      const isThresholdExceeded = budget.notifications?.enabled && 
        spendingPercentage >= (budget.notifications.threshold || 80);

      return {
        id: budget.id,
        category: budget.Category.name,
        amount: budget.amount,
        spent: spending,
        remaining: budget.amount - spending,
        spendingPercentage,
        period: budget.period,
        isThresholdExceeded,
        threshold: budget.notifications?.threshold || 80
      };
    }));

    res.json(budgetStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  getBudgetStatus
}; 