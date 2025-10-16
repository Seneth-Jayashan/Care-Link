// routes/api/subscriptionRoutes.js

import express from 'express';
import { check } from 'express-validator';
import * as subscriptionController from '../controllers/subscriptionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorize from '../middlewares/roleMiddleware.js';

const router = express.Router();

// --- Admin Routes for managing plans ---

// @route   POST /api/subscriptions/plans
// @desc    Create a new subscription plan
// @access  Private (Admin)
router.post(
    '/plans',
    [
        authMiddleware,
        authorize('admin'),
        check('name', 'Plan name is required').not().isEmpty(),
        check('price', 'Price is required').isNumeric(),
        check('billingCycle', 'Billing cycle must be monthly or annually').isIn(['monthly', 'annually'])
    ],
    subscriptionController.createPlan
);

// --- Public & Patient Routes ---

// @route   GET /api/subscriptions/plans
// @desc    Get all available plans
// @access  Public
router.get('/plans', subscriptionController.getAllPlans);

// @route   POST /api/subscriptions/subscribe
// @desc    Subscribe to a plan
// @access  Private (Patient)
router.post(
    '/subscribe',
    [
        authMiddleware,
        authorize('patient'),
        check('planId', 'Plan ID is required').isMongoId()
    ],
    subscriptionController.subscribeToPlan
);

// @route   GET /api/subscriptions/my-subscription
// @desc    Get my current subscription
// @access  Private (Patient)
router.get(
    '/my-subscription',
    authMiddleware,
    authorize('patient'),
    subscriptionController.getMySubscription
);

// @route   PATCH /api/subscriptions/my-subscription/cancel
// @desc    Cancel my subscription
// @access  Private (Patient)
router.patch(
    '/my-subscription/cancel',
    authMiddleware,
    authorize('patient'),
    subscriptionController.cancelSubscription
);

export default router;
