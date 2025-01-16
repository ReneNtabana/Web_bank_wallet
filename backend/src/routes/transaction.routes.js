const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transaction.controller');
const { transactionValidator } = require('../middleware/validators/transaction.validator');

router.route('/')
  .post(protect, transactionValidator, createTransaction)
  .get(protect, getTransactions);

router.route('/:id')
  .get(protect, getTransaction)
  .put(protect, transactionValidator, updateTransaction)
  .delete(protect, deleteTransaction);

module.exports = router; 