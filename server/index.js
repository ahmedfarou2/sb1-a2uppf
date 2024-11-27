import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import userRoutes from './routes/users.js';
import organizationRoutes from './routes/organizations.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);

// Database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});