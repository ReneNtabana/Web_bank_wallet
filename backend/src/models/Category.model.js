import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

const Category = sequelize.define('Category', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('income', 'expense'),
    allowNull: false
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#000000'
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'default-icon'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true
});

export { Category }; 