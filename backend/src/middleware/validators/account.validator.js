import { check } from 'express-validator';

const accountValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('type', 'Invalid account type').isIn(['bank', 'cash', 'mobile_money', 'other']),
  check('currency', 'Currency is required').not().isEmpty(),
  check('balance').optional().isNumeric(),
  check('description').optional().isString(),
  check('isActive').optional().isBoolean()
];

export { accountValidator }; 