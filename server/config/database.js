import { Sequelize } from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Development: SQLite configuration
const devConfig = {
  dialect: 'sqlite',
  storage: join(__dirname, '../../database.sqlite'),
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
};

// Production: MySQL configuration
const prodConfig = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
const sequelize = new Sequelize(config);

export default sequelize;