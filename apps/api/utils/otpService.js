// utils/otpService.js
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const generateAndSaveOtp = async (user) => {
  // generate 6-digit numeric OTP
  const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  const hash = await bcrypt.hash(otp, 10);
  user.profile = user.profile || {};
  user.profile.otpHash = hash;
  user.profile.otpExpires = Date.now() + OTP_TTL_MS;
  await user.save();
  return otp; // plain OTP — send via email/SMS
};

export const verifyOtpForUser = async (user, otp) => {
  if (!user.profile?.otpHash || !user.profile?.otpExpires) return false;
  if (Date.now() > user.profile.otpExpires) return false;
  const ok = await bcrypt.compare(otp, user.profile.otpHash);
  if (!ok) return false;
  // clear OTP
  delete user.profile.otpHash;
  delete user.profile.otpExpires;
  await user.save();
  return true;
};
