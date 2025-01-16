import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { categoryValidator } from '../middleware/validators/category.validator.js';

const router = express.Router();

router.route('/')
  .post(protect, categoryValidator, createCategory)
  .get(protect, getCategories);

router.route('/:id')
  .get(protect, getCategory)
  .put(protect, categoryValidator, updateCategory)
  .delete(protect, deleteCategory);

export default router; 