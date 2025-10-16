// routes/authRoutes.js
import express from 'express';
import { register, login, logout, me, verifyRegistrationOtp, resendOtp, enable2FA, verifyEnable2FA, verify2FA, disable2FA } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', verifyRegistrationOtp);
router.post('/resend-otp', resendOtp);

router.post('/login', login);
router.post('/verify-2fa', verify2FA); // uses tempToken in Authorization header
router.post('/logout', protect, logout);
router.get('/me', protect, me);

// 2FA management (protected)
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/verify-enable', protect, verifyEnable2FA);
router.post('/2fa/disable', protect, disable2FA);

export default router;
