import { check } from 'express-validator';

export const accountValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Account name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Account name must be between 2 and 50 characters'),

  check('type')
    .isIn(['bank', 'cash', 'mobile_money', 'other'])
    .withMessage('Invalid account type'),

  check('balance')
    .isFloat({ min: 0 })
    .withMessage('Balance must be a non-negative number'),

  check('currency')
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be a 3-letter code')
    .isUppercase()
    .withMessage('Currency must be uppercase')
    .default('USD'),

  check('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
]; 