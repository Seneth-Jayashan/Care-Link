import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { createAppointment, getAppointmentsForUser, cancelAppointment } from '../controllers/appointmentController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('patient'), createAppointment);
router.get('/', protect, getAppointmentsForUser);
router.post('/:id/cancel', protect, cancelAppointment);

export default router;