import { check } from 'express-validator';

export const budgetValidator = [
  check('categoryId')
    .notEmpty()
    .withMessage('Category ID is required')
    .isMongoId()
    .withMessage('Invalid category ID format'),

  check('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be a positive number'),

  check('period')
    .isIn(['daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid period'),

  check('startDate')
    .isISO8601()
    .withMessage('Invalid start date format')
    .toDate()
    .custom((startDate) => {
      if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),

  check('endDate')
    .isISO8601()
    .withMessage('Invalid end date format')
    .toDate()
    .custom((endDate, { req }) => {
      if (endDate <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),

  check('notifications')
    .optional()
    .isObject()
    .withMessage('Notifications must be an object'),

  check('notifications.enabled')
    .optional()
    .isBoolean()
    .withMessage('notifications.enabled must be a boolean'),

  check('notifications.threshold')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('notifications.threshold must be between 0 and 100')
]; 