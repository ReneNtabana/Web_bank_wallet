import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 3000,
    idle: 10000
  }
});

// Initialize database connection
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', {
      error: error.message,
      database_url_exists: !!process.env.DATABASE_URL,
      env: process.env.NODE_ENV
    });
    return false;
  }
};

// Initialize connection

initDatabase();

export default sequelize;
