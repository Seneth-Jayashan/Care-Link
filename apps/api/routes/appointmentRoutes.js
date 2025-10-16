// routes/api/appointmentRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as appointmentController from '../controllers/appointmentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   POST /api/appointments
// @desc    Book a new appointment
// @access  Private (Patient only)
router.post(
  '/',
  [
    authMiddleware,
    authorize('patient'),
    check('doctorId', 'Doctor ID is required').isMongoId(),
    check('scheduledAt', 'Appointment date is required').isISO8601().toDate(),
    check('reason', 'Reason for visit is required').not().isEmpty(),
  ],
  appointmentController.createAppointment
);

// @route   GET /api/appointments/my
// @desc    Get my appointments (for both patients and doctors)
// @access  Private
router.get('/my', authMiddleware, appointmentController.getMyAppointments);

// @route   PATCH /api/appointments/:id/status
// @desc    Update appointment status (confirm/cancel)
// @access  Private
router.patch(
  '/:id/status',
  [
    authMiddleware,
    check('status', 'Status is required').not().isEmpty(),
  ],
  appointmentController.updateAppointmentStatus
);

export default router;
