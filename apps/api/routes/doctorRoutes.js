// routes/api/doctorRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as doctorController from '../controllers/doctorController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   GET /api/doctors/me
// @desc    Get current doctor's profile
// @access  Private (Doctor only)
router.get('/me', authMiddleware, authorize('doctor'), doctorController.getMyProfile);

// @route   PUT /api/doctors/me
// @desc    Update current doctor's profile
// @access  Private (Doctor only)
router.put(
  '/me', 
  [
    authMiddleware,
    authorize('doctor'),
    // Optional: Add validation for incoming data
    check('specialty', 'Specialty is required').not().isEmpty(),
    check('consultationFee', 'Consultation fee must be a number').optional().isNumeric(),
    check('availability', 'Availability must be an array').optional().isArray(),
  ], 
  doctorController.updateMyProfile
);

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', doctorController.getAllDoctors);

// @route   GET /api/doctors/:userId
// @desc    Get a doctor's public profile by ID
// @access  Public
router.get('/:userId', doctorController.getDoctorById);

export default router;
