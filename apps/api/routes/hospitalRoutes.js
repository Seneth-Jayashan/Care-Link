// routes/api/hospitalRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as hospitalController from '../controllers/hospitalController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// @route   POST /api/hospitals
// @desc    Create a new hospital
// @access  Private (Admin only)
router.post(
  '/',
  [
    authMiddleware,
    authorize('admin'),
    check('name', 'Hospital name is required').not().isEmpty(),
    check('code', 'A unique hospital code is required').not().isEmpty(),
  ],
  hospitalController.createHospital
);

// @route   GET /api/hospitals
// @desc    Get all hospitals
// @access  Public
router.get('/', hospitalController.getAllHospitals);

// @route   PUT /api/hospitals/:id
// @desc    Update a hospital
// @access  Private (Admin only)
router.put(
  '/:id',
  [
    authMiddleware,
    authorize('admin'),
    check('name', 'Hospital name is required').not().isEmpty(),
  ],
  hospitalController.updateHospital
);

export default router;
