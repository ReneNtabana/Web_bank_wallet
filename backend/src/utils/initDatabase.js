import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User.model.js';
import { Category } from '../models/Category.model.js';
import { Account } from '../models/Account.model.js';
import bcrypt from 'bcryptjs';
import { seedCategories } from './seedCategories.js';

dotenv.config();

const createDefaultUser = async () => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword
    });
    console.log('Default user created:', user.email);
    return user;
  } catch (error) {
    console.error('Error creating default user:', error);
    throw error;
  }
};

const createDefaultAccounts = async (userId) => {
  try {
    const accounts = await Account.create([
      {
        name: 'Main Bank Account',
        type: 'bank',
        balance: 5000,
        currency: 'USD',
        user: userId
      },
      {
        name: 'Savings',
        type: 'bank',
        balance: 10000,
        currency: 'USD',
        user: userId
      },
      {
        name: 'Cash Wallet',
        type: 'cash',
        balance: 500,
        currency: 'USD',
        user: userId
      }
    ]);
    console.log('Default accounts created:', accounts.length);
    return accounts;
  } catch (error) {
    console.error('Error creating default accounts:', error);
    throw error;
  }
};

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Account.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Create default user
    const user = await createDefaultUser();

    // Seed default categories
    await seedCategories();

    // Create default accounts
    await createDefaultAccounts(user._id);

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

// Run the initialization if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase();
}

export { initDatabase }; 