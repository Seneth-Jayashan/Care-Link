// routes/api/adminRoutes.js

import express from 'express';
import * as adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes in this file are protected and for admins only
router.use(authMiddleware, authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminController.getAllUsers);

// @route   PATCH /api/admin/users/:userId/status
// @desc    Activate or deactivate a user
// @access  Private (Admin only)
router.patch('/users/:userId/status', adminController.updateUserStatus);

export default router;
