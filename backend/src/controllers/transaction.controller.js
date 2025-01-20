import { Transaction } from '../models/Transaction.model.js';
import { Account } from '../models/Account.model.js';
import { validationResult } from 'express-validator';
import NotificationService from '../services/notification.service.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, accountId, categoryId, description, date, toAccountId } = req.body;

    // Start a session for transaction atomicity
    const session = await Transaction.startSession();
    session.startTransaction();

    try {
      // Create the transaction
      const transaction = await Transaction.create([{
        type,
        amount,
        account: accountId,
        category: categoryId,
        description,
        date: date || new Date(),
        toAccount: toAccountId,
        user: req.user._id
      }], { session });

      // Update account balances
      if (type === 'transfer' && toAccountId) {
        // Handle transfer between accounts
        await Account.findByIdAndUpdate(
          accountId,
          { $inc: { balance: -amount } },
          { session }
        );
        await Account.findByIdAndUpdate(
          toAccountId,
          { $inc: { balance: amount } },
          { session }
        );
      } else {
        // Handle income/expense
        const balanceChange = type === 'income' ? amount : -amount;
        await Account.findByIdAndUpdate(
          accountId,
          { $inc: { balance: balanceChange } },
          { session }
        );
      }

      await session.commitTransaction();
      
      // Check budget notifications after transaction is committed
      if (type === 'expense') {
        const notifications = await NotificationService.checkBudgetThresholds(
          req.user._id,
          transaction[0]
        );
        
        if (notifications.length > 0) {
          return res.status(201).json({
            transaction: transaction[0],
            notifications
          });
        }
      }

      res.status(201).json(transaction[0]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      type, 
      accountId, 
      categoryId,
      limit = 50,
      offset = 0
    } = req.query;

    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (type) query.type = type;
    if (accountId) query.account = accountId;
    if (categoryId) query.category = categoryId;

    const transactions = await Transaction.find(query)
      .sort({ date: -1, createdAt: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .populate('account', 'name type')
      .populate('category', 'name type')
      .populate('toAccount', 'name type');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    })
    .populate('account', 'name type')
    .populate('category', 'name type')
    .populate('toAccount', 'name type');

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
export const deleteTransaction = async (req, res) => {
  try {
    const session = await Transaction.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        user: req.user._id
      }).session(session);

      if (!transaction) {
        await session.abortTransaction();
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Reverse the account balance changes
      if (transaction.type === 'transfer' && transaction.toAccount) {
        await Account.findByIdAndUpdate(
          transaction.account,
          { $inc: { balance: transaction.amount } },
          { session }
        );
        await Account.findByIdAndUpdate(
          transaction.toAccount,
          { $inc: { balance: -transaction.amount } },
          { session }
        );
      } else {
        const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
        await Account.findByIdAndUpdate(
          transaction.account,
          { $inc: { balance: balanceChange } },
          { session }
        );
      }

      await transaction.deleteOne({ session });
      await session.commitTransaction();
      res.json({ message: 'Transaction removed' });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  updateTransaction,
}; 