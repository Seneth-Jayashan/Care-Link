// routes/api/patientRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as patientController from '../controllers/patientController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   GET /api/patients/me
// @desc    Get current patient's profile
// @access  Private (Patient only)
router.get('/me', authMiddleware, authorize('patient'), patientController.getMyProfile);

// @route   PUT /api/patients/me
// @desc    Update current patient's profile
// @access  Private (Patient only)
router.put(
  '/me',
  [
    authMiddleware,
    authorize('patient'),
    check('gender', 'Invalid gender value')
      .optional()
      .isIn(['male', 'female', 'other', 'unknown']),
    check('dob', 'Invalid date of birth').optional().isISO8601().toDate(),
  ],
  patientController.updateMyProfile
);

// @route   GET /api/patients/:userId
// @desc    Get patient profile by ID
// @access  Private (Admin and Doctor only)
router.get(
  '/:userId',
  authMiddleware,
  authorize('admin', 'doctor'),
  patientController.getPatientById
);

export default router;
