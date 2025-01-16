import { Account } from '../models/index.js';
import { validationResult } from 'express-validator';

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
const createAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, currency, description } = req.body;
    const account = await Account.create({
      userId: req.user.id,
      name,
      type,
      currency,
      description
    });

    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all accounts for user
// @route   GET /api/accounts
// @access  Private
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
const getAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
const updateAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const { name, type, currency, description, isActive } = req.body;
    
    await account.update({
      name: name || account.name,
      type: type || account.type,
      currency: currency || account.currency,
      description: description || account.description,
      isActive: isActive !== undefined ? isActive : account.isActive
    });

    res.json(account);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await account.destroy();
    res.json({ message: 'Account removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount
}; 