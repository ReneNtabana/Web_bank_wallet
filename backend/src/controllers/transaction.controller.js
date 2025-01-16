import { Transaction, Account, Category } from '../models/index.js';
import { validationResult } from 'express-validator';
import { sequelize } from '../config/database.js';
import NotificationService from '../services/notification.service.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { accountId, categoryId, type, amount, description, date, attachments, location } = req.body;

    // Verify account ownership
    const account = await Account.findOne({
      where: { id: accountId, userId: req.user.id }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      accountId,
      categoryId,
      type,
      amount,
      description,
      date: date || new Date(),
      attachments,
      location
    }, { transaction: t });

    // Update account balance
    const balanceChange = type === 'income' ? amount : -amount;
    await account.increment('balance', { 
      by: balanceChange,
      transaction: t 
    });

    await t.commit();
    
    // Check budget notifications after transaction is committed
    if (transaction.type === 'expense') {
      const notifications = await NotificationService.checkBudgetThresholds(
        req.user.id,
        transaction
      );
      
      if (notifications.length > 0) {
        return res.status(201).json({
          transaction,
          notifications
        });
      }
    }

    res.status(201).json(transaction);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all transactions for user
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, type, accountId, categoryId } = req.query;
    
    const where = { userId: req.user.id };
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    if (type) where.type = type;
    if (accountId) where.accountId = accountId;
    if (categoryId) where.categoryId = categoryId;

    const transactions = await Transaction.findAll({
      where,
      include: [
        { model: Account, attributes: ['name', 'type'] },
        { model: Category, attributes: ['name', 'type'] }
      ],
      order: [['date', 'DESC']]
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [
        { model: Account, attributes: ['name', 'type'] },
        { model: Category, attributes: ['name', 'type'] }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const transaction = await Transaction.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: Account }],
      transaction: t
    });

    if (!transaction) {
      await t.rollback();
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const { amount, type } = req.body;
    
    // If amount or type changed, update account balance
    if (amount !== transaction.amount || type !== transaction.type) {
      // Reverse old transaction
      const oldBalanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
      await transaction.Account.increment('balance', { 
        by: oldBalanceChange,
        transaction: t 
      });

      // Apply new transaction
      const newBalanceChange = type === 'income' ? amount : -amount;
      await transaction.Account.increment('balance', { 
        by: newBalanceChange,
        transaction: t 
      });
    }

    await transaction.update(req.body, { transaction: t });
    await t.commit();
    
    res.json(transaction);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  const t = await sequelize.transaction();
  
  try {
    const transaction = await Transaction.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      },
      include: [{ model: Account }],
      transaction: t
    });

    if (!transaction) {
      await t.rollback();
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Reverse transaction amount from account balance
    const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
    await transaction.Account.increment('balance', { 
      by: balanceChange,
      transaction: t 
    });

    await transaction.destroy({ transaction: t });
    await t.commit();
    
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
}; 