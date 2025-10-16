// routes/paymentRoutes.js
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { createLocalPayment, getPaymentsForUser } from '../controllers/paymentController.js';

const router = express.Router();

// Create a local payment (e.g., cash / manual)
router.post('/local', protect, createLocalPayment);

// Get all payments for the logged-in user
router.get('/', protect, getPaymentsForUser);

export default router;
