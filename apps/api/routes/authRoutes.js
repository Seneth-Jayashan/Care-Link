// routes/api/authRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    check('firstName', 'First name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['patient', 'doctor', 'admin']), // Customize roles as needed
  ],
  authController.register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', authMiddleware, authController.getMe);

export default router;
