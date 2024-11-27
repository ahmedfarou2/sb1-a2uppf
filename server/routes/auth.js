import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email,
        nameEn: email.split('@')[0],
        role: email === process.env.SYSTEM_ADMIN_EMAIL ? 'SYSTEM_ADMIN' : 'USER'
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, nameEn } = req.body;
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      email,
      nameEn,
      role: email === process.env.SYSTEM_ADMIN_EMAIL ? 'SYSTEM_ADMIN' : 'USER'
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;