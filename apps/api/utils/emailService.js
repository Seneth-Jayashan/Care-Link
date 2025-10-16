// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Zoho SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.zoho.com',
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  secure: false, // true if port 465
  auth: {
    user: process.env.EMAIL_USER, // your Zoho email
    pass: process.env.EMAIL_PASS, // Zoho App Password
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Zoho Email transporter verification failed:', error);
  } else {
    console.log('Zoho Email transporter is ready');
  }
});

// Generic email sender
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"CareLink" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || '',
      html,
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Email could not be sent');
  }
};

// Verification email
export const sendVerificationEmail = async (to, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <p>Welcome to CareLink!</p>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verifyUrl}">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
  `;
  return sendEmail({ to, subject: 'Verify Your CareLink Account', html });
};

// Password reset email
export const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;
  return sendEmail({ to, subject: 'CareLink Password Reset', html });
};
