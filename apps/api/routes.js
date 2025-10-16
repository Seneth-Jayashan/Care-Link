import express from 'express';
const router = express.Router();

import authRoutes from './routes/authRoutes.js';
import appointmentController from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import encounterRoutes from './routes/encounterRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import medicalReportRoutes from './routes/medicalReportRoutes.js';
import patientRoutes from './routes/patientsRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';




// --- Routes ---
router.use('/auth', authRoutes);
router.use('/appointment', appointmentController);
router.use('/admin', adminRoutes);
router.use('/doctors', doctorRoutes);
router.use('/encounters', encounterRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/reports', medicalReportRoutes);
router.use('/patients', patientRoutes);
router.use('/payments', paymentRoutes);
router.use('/prescriptions', prescriptionRoutes);
router.use('/subscriptions', subscriptionRoutes);



export default router;
