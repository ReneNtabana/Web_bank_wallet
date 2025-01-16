import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount
} from '../controllers/account.controller.js';
import { accountValidator } from '../middleware/validators/account.validator.js';

const router = express.Router();

router.route('/')
  .post(protect, accountValidator, createAccount)
  .get(protect, getAccounts);

router.route('/:id')
  .get(protect, getAccount)
  .put(protect, accountValidator, updateAccount)
  .delete(protect, deleteAccount);

export default router; 