const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { categoryValidator } = require('../middleware/validators/category.validator');

router.route('/')
  .post(protect, categoryValidator, createCategory)
  .get(protect, getCategories);

router.route('/:id')
  .get(protect, getCategory)
  .put(protect, categoryValidator, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router; 