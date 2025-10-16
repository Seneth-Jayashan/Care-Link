// routes/api/prescriptionRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as prescriptionController from '../controllers/prescriptionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   POST /api/prescriptions
// @desc    Create a new prescription
// @access  Private (Doctor only)
router.post(
  '/',
  [
    authMiddleware,
    authorize('doctor'),
    check('encounterId', 'Encounter ID is required').isMongoId(),
    check('medications', 'Medications list is required and must be an array').isArray({ min: 1 }),
  ],
  prescriptionController.createPrescription
);

// @route   GET /api/prescriptions/my
// @desc    Get all of the logged-in patient's prescriptions
// @access  Private (Patient only)
router.get(
  '/my',
  authMiddleware,
  authorize('patient'),
  prescriptionController.getMyPrescriptions
);

export default router;
