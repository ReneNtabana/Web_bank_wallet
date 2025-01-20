import { check } from 'express-validator';

export const transactionValidator = [
  check('type')
    .isIn(['income', 'expense', 'transfer'])
    .withMessage('Invalid transaction type'),

  check('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  check('accountId')
    .notEmpty()
    .withMessage('Account ID is required')
    .isMongoId()
    .withMessage('Invalid account ID format'),

  check('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  check('toAccountId')
    .optional()
    .isMongoId()
    .withMessage('Invalid to-account ID format')
    .custom((value, { req }) => {
      if (req.body.type === 'transfer' && !value) {
        throw new Error('To-account ID is required for transfers');
      }
      if (req.body.type !== 'transfer' && value) {
        throw new Error('To-account ID should only be provided for transfers');
      }
      if (value === req.body.accountId) {
        throw new Error('Cannot transfer to the same account');
      }
      return true;
    }),

  check('date')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format')
    .toDate(),

  check('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
]; 