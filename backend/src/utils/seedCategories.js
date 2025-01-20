import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category.model.js';

dotenv.config();

const defaultCategories = [
  // Income categories
  {
    name: 'Salary',
    type: 'income',
    color: '#4CAF50',
    icon: '💰'
  },
  {
    name: 'Investments',
    type: 'income',
    color: '#2196F3',
    icon: '📈'
  },
  {
    name: 'Freelance',
    type: 'income',
    color: '#9C27B0',
    icon: '💻'
  },
  
  // Expense categories
  {
    name: 'Housing',
    type: 'expense',
    color: '#F44336',
    icon: '🏠'
  },
  {
    name: 'Transportation',
    type: 'expense',
    color: '#FF9800',
    icon: '🚗'
  },
  {
    name: 'Food & Dining',
    type: 'expense',
    color: '#795548',
    icon: '🍽️'
  },
  {
    name: 'Utilities',
    type: 'expense',
    color: '#607D8B',
    icon: '💡'
  },
  {
    name: 'Shopping',
    type: 'expense',
    color: '#E91E63',
    icon: '🛍️'
  },
  {
    name: 'Entertainment',
    type: 'expense',
    color: '#673AB7',
    icon: '🎬'
  },
  {
    name: 'Healthcare',
    type: 'expense',
    color: '#00BCD4',
    icon: '🏥'
  },
  {
    name: 'Education',
    type: 'expense',
    color: '#3F51B5',
    icon: '📚'
  }
];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing default categories
    await Category.deleteMany({ user: null });

    // Insert new default categories
    await Category.insertMany(
      defaultCategories.map(category => ({ ...category, user: null }))
    );

    console.log('Default categories seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

// Run the seed function if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedCategories();
}

export { seedCategories }; 