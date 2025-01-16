import { User } from './User.model.js';
import  { Account}  from './Account.model.js';
import { Category } from './Category.model.js';
import { Transaction } from './Transaction.model.js';
import { Budget } from './Budget.model.js';

// User Associations
User.hasMany(Account, { foreignKey: 'userId' });
User.hasMany(Category, { foreignKey: 'userId' });
User.hasMany(Transaction, { foreignKey: 'userId' });
User.hasMany(Budget, { foreignKey: 'userId' });

// Account Associations
Account.belongsTo(User, { foreignKey: 'userId' });
Account.hasMany(Transaction, { foreignKey: 'accountId' });

// Category Associations
Category.belongsTo(User, { foreignKey: 'userId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });
Category.hasMany(Category, { as: 'subcategories', foreignKey: 'parentId' });
Category.hasMany(Transaction, { foreignKey: 'categoryId' });
Category.hasMany(Budget, { foreignKey: 'categoryId' });

// Transaction Associations
Transaction.belongsTo(User, { foreignKey: 'userId' });
Transaction.belongsTo(Account, { foreignKey: 'accountId' });
Transaction.belongsTo(Category, { foreignKey: 'categoryId' });

// Budget Associations
Budget.belongsTo(User, { foreignKey: 'userId' });
Budget.belongsTo(Category, { foreignKey: 'categoryId' });

export {
  User,
  Account,
  Category,
  Transaction,
  Budget
}; 