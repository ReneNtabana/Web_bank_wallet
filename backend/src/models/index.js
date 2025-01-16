const User = require('./User.model');
const Account = require('./Account.model');
const Category = require('./Category.model');
const Transaction = require('./Transaction.model');
const Budget = require('./Budget.model');

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

module.exports = {
  User,
  Account,
  Category,
  Transaction,
  Budget
}; 