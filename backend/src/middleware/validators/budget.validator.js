import { check } from 'express-validator';

const budgetValidator = [
  check('categoryId', 'Category ID is required').isInt(),
  check('amount', 'Amount must be a positive number').isFloat({ min: 0.01 }),
  check('period', 'Invalid period')
    .isIn(['daily', 'weekly', 'monthly', 'yearly']),
  check('startDate', 'Start date is required')
    .isISO8601()
    .toDate(),
  check('endDate', 'End date is required')
    .isISO8601()
    .toDate()
    .custom((endDate, { req }) => {
      if (new Date(endDate) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  check('notifications')
    .optional()
    .isObject()
    .custom((notifications) => {
      if (notifications) {
        if (typeof notifications.enabled !== 'boolean') {
          throw new Error('notifications.enabled must be a boolean');
        }
        if (notifications.threshold && (notifications.threshold < 0 || notifications.threshold > 100)) {
          throw new Error('notifications.threshold must be between 0 and 100');
        }
      }
      return true;
    })
];

export { budgetValidator }; 