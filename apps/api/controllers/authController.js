// controllers/authController.js
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
//import { sendEmail } from '../utils/emailService.js';
import { generateAndSaveOtp, verifyOtpForUser } from '../utils/otpService.js';
import speakeasy from 'speakeasy';

const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || '7d' });
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + (process.env.COOKIE_EXPIRE_DAYS ? Number(process.env.COOKIE_EXPIRE_DAYS)*24*60*60*1000 : 7*24*60*60*1000)),
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('token', token, cookieOptions);
  res.status(statusCode).json({ token, user: { id: user._id, email: user.email, role: user.role, fullName: user.fullName } });
};

// Register: create inactive user, send OTP via email
export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, phone, role = 'patient', profile = {} } = req.body;
  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already in use'); }
  const user = await User.create({ fullName, email, password, phone, role, profile, status: 'inactive' });

  // generate OTP and send
  const otp = await generateAndSaveOtp(user);
  await sendEmail(email, 'CareLink — Verify your account', `Your CareLink verification code: ${otp}. It expires in 10 minutes.`);

  res.status(201).json({ message: 'Registered. Please verify OTP sent to your email.', userId: user._id });
});

// Verify registration OTP
export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId);
  if (!user) { res.status(404); throw new Error('User not found'); }
  const ok = await verifyOtpForUser(user, otp);
  if (!ok) { res.status(400); throw new Error('Invalid or expired OTP'); }
  user.status = 'active';
  await user.save();
  createSendToken(user, 200, res);
});

// Resend OTP
export const resendOtp = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) { res.status(404); throw new Error('User not found'); }
  const otp = await generateAndSaveOtp(user);
  await sendEmail(user.email, 'CareLink — Your verification code', `Your verification code: ${otp}.`);
  res.json({ message: 'OTP resent' });
});

// Login flow with optional 2FA
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) { res.status(401); throw new Error('Invalid credentials'); }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) { res.status(401); throw new Error('Invalid credentials'); }
  if (user.status !== 'active') { res.status(403); throw new Error('Account not active. Verify email.'); }

  // if user has 2FA enabled -> create short lived temp token and ask for TOTP
  if (user.profile?.twoFA?.enabled) {
    const tempToken = jwt.sign({ id: user._id, twoFA: true }, process.env.JWT_SECRET, { expiresIn: '5m' });
    return res.json({ twoFA: true, tempToken, message: '2FA token required' });
  }

  // else issue normal token
  createSendToken(user, 200, res);
});

// Verify 2FA TOTP and issue final JWT
export const verify2FA = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const authHeader = req.headers.authorization || '';
  const temp = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  if (!temp) { res.status(401); throw new Error('Temp token required'); }

  let decoded;
  try { decoded = jwt.verify(temp, process.env.JWT_SECRET); } catch (err) { res.status(401); throw new Error('Temp token invalid or expired'); }
  if (!decoded?.twoFA || !decoded?.id) { res.status(401); throw new Error('Invalid temp token'); }

  const user = await User.findById(decoded.id);
  if (!user || !user.profile?.twoFA?.enabled) { res.status(400); throw new Error('2FA not enabled for user'); }

  const verified = speakeasy.totp.verify({ secret: user.profile.twoFA.secret, encoding: 'base32', token, window: 1 });
  if (!verified) { res.status(401); throw new Error('Invalid 2FA code'); }

  // success: issue normal token
  createSendToken(user, 200, res);
});

// Enable 2FA (generate secret and return QR/otpauth_url) — user must verify to finalize
export const enable2FA = asyncHandler(async (req, res) => {
  // protect required in route
  const user = req.user;
  const secret = speakeasy.generateSecret({ name: `CareLink (${user.email})` });
  // store temp secret until user verifies
  user.profile = user.profile || {};
  user.profile.twoFA = user.profile.twoFA || {};
  user.profile.twoFA.tempSecret = secret.base32;
  await user.save();
  // return otpauth_url and base32 so frontend can generate QR for authenticator apps
  res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
});

// Verify enabling 2FA (final step) — user posts a TOTP to confirm and enable
export const verifyEnable2FA = asyncHandler(async (req, res) => {
  const user = req.user;
  const { token } = req.body;
  const tempSecret = user.profile?.twoFA?.tempSecret;
  if (!tempSecret) { res.status(400); throw new Error('No pending 2FA setup'); }
  const verified = speakeasy.totp.verify({ secret: tempSecret, encoding: 'base32', token, window: 1 });
  if (!verified) { res.status(400); throw new Error('Invalid 2FA token'); }
  // finalize 2FA
  user.profile.twoFA = { secret: tempSecret, enabled: true, createdAt: new Date() };
  delete user.profile.twoFA.tempSecret;
  await user.save();
  res.json({ message: '2FA enabled' });
});

// Disable 2FA
export const disable2FA = asyncHandler(async (req, res) => {
  const user = req.user;
  if (user.profile?.twoFA) {
    user.profile.twoFA = { enabled: false };
    await user.save();
  }
  res.json({ message: '2FA disabled' });
});

// keep logout and me as before
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 5*1000), httpOnly: true });
  res.json({ message: 'Logged out' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ user });
});
