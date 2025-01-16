import { check } from 'express-validator';

const categoryValidator = [
  check('name', 'Name is required').not().isEmpty(),
  check('type', 'Invalid category type').isIn(['income', 'expense']),
  check('parentId').optional().isInt(),
  check('color').optional().matches(/^#[0-9A-Fa-f]{6}$/),
  check('icon').optional().isString(),
  check('isActive').optional().isBoolean()
];

export { categoryValidator }; 