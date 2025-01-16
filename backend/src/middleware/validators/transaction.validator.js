import { check } from 'express-validator';

const transactionValidator = [
  check('accountId', 'Account ID is required').isInt(),
  check('categoryId', 'Category ID is required').isInt(),
  check('type', 'Invalid transaction type').isIn(['income', 'expense', 'transfer']),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
  check('description').optional().isString(),
  check('date').optional().isISO8601().toDate(),
  check('attachments').optional().isArray(),
  check('location').optional().isObject(),
  check('status').optional().isIn(['completed', 'pending', 'cancelled'])
];

export { transactionValidator }; 