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
  logging: false,
  pool: {
    max: 2,
    min: 0,
    idle: 0,
    acquire: 3000,
    evict: 30000
  }
});

// Test and initialize connection
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
    await sequelize.sync();
    console.log('Database synchronized');
  } catch (error) {
    console.error('Connection error details:', {
      url: process.env.DATABASE_URL?.split('@')[1], // Log only host part for security
      error: error.message
    });
  }
};

initDatabase();

export default sequelize;
