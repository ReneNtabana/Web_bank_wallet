import { check } from 'express-validator';

export const categoryValidator = [
  check('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Category name must be between 2 and 50 characters'),

  check('type')
    .isIn(['income', 'expense'])
    .withMessage('Invalid category type'),

  check('color')
    .optional()
    .isHexColor()
    .withMessage('Invalid color format'),

  check('icon')
    .optional()
    .isString()
    .withMessage('Icon must be a string')
]; 