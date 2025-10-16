// routes/api/encounterRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as encounterController from '../controllers/encounterController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   POST /api/encounters
// @desc    Create an encounter record
// @access  Private (Doctor only)
router.post(
  '/',
  [
    authMiddleware,
    authorize('doctor'),
    check('appointmentId', 'Appointment ID is required').isMongoId(),
    check('presentingComplaint', 'Presenting complaint is required').not().isEmpty(),
  ],
  encounterController.createEncounter
);

// @route   GET /api/encounters/patient/:patientId
// @desc    Get all encounters for a patient
// @access  Private (Doctors for now, can be expanded)
router.get(
  '/patient/:patientId',
  authMiddleware,
  authorize('doctor'), // You could add 'patient' here with extra logic
  encounterController.getEncountersForPatient
);

export default router;
