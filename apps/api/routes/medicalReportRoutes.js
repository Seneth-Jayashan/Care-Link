// routes/api/medicalReportRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as medicalReportController from '../controllers/medicalReportController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';
import upload from '../middlewares/fileUpload.js';

const router = express.Router();

// @route   POST /api/reports
// @desc    Upload a medical report
// @access  Private (Doctor, Staff, Admin)
router.post(
  '/',
  [
    authMiddleware,
    authorize('doctor', 'staff', 'admin'),
    upload.single('reportFile'), // 'reportFile' is the form field name
    check('patientId', 'Patient ID is required').isMongoId(),
    check('title', 'Report title is required').not().isEmpty(),
    check('type', 'Report type is required').not().isEmpty(),
  ],
  medicalReportController.uploadReport
);

// @route   GET /api/reports/patient/:patientId
// @desc    Get all reports for a patient
// @access  Private (Patient, Doctor, Staff, Admin)
router.get(
  '/patient/:patientId',
  authMiddleware,
  medicalReportController.getReportsForPatient
);

export default router;
