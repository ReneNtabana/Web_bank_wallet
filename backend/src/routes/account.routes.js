const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createAccount,
  getAccounts,
  getAccount,
  updateAccount,
  deleteAccount
} = require('../controllers/account.controller');
const { accountValidator } = require('../middleware/validators/account.validator');

router.route('/')
  .post(protect, accountValidator, createAccount)
  .get(protect, getAccounts);

router.route('/:id')
  .get(protect, getAccount)
  .put(protect, accountValidator, updateAccount)
  .delete(protect, deleteAccount);

module.exports = router; 