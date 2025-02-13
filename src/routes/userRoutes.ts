
import express from 'express';
import { User } from '../lib/models/User';
import { generateToken } from '../lib/utils/jwt';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: 'free'
    });

    await user.save();

    const token = generateToken({ userId: user._id });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

export default router;
