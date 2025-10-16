// routes/api/paymentRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as paymentController from '../controllers/paymentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   POST /api/payments/initiate
// @desc    Initiate a payment for a service
// @access  Private (Patient only)
router.post(
  '/initiate',
  [
    authMiddleware,
    authorize('patient'),
    check('appointmentId', 'Appointment ID is required').isMongoId(),
    check('amount', 'Payment amount is required and must be numeric').isNumeric(),
    check('method', 'Payment method is required').isIn(['card', 'cash', 'online', 'wallet']),
  ],
  paymentController.initiateAppointmentPayment
);

// @route   POST /api/payments/:paymentId/confirm
// @desc    Confirm a payment (Admin action)
// @access  Private (Admin, Staff only)
router.post(
  '/:paymentId/confirm',
  authMiddleware,
  authorize('admin', 'staff'),
  paymentController.confirmPayment
);

// @route   GET /api/payments/my-history
// @desc    Get the logged-in user's payment history
// @access  Private (Patient only)
router.get(
  '/my-history',
  authMiddleware,
  authorize('patient'),
  paymentController.getMyPaymentHistory
);

export default router;
