import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/transaction.controller.js';
import { transactionValidator } from '../middleware/validators/transaction.validator.js';

const router = express.Router();

router.route('/')
  .post(protect, transactionValidator, createTransaction)
  .get(protect, getTransactions);

router.route('/:id')
  .get(protect, getTransaction)
  .put(protect, transactionValidator, updateTransaction)
  .delete(protect, deleteTransaction);

export default router; 