import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';

export const createAppointment = asyncHandler(async (req, res) => {
  const { doctorId, scheduledAt, reason } = req.body;
  // basic checks
  const doctor = await User.findById(doctorId);
  if (!doctor || doctor.role !== 'doctor') { res.status(400); throw new Error('Invalid doctor'); }
  const appointment = await Appointment.create({ patient: req.user._id, doctor: doctorId, scheduledAt, reason });
  res.status(201).json({ appointment });
});

export const getAppointmentsForUser = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'patient' ? { patient: req.user._id } : req.user.role === 'doctor' ? { doctor: req.user._id } : {};
  const items = await Appointment.find(filter).populate('patient','fullName email').populate('doctor','fullName email');
  res.json({ items });
});

export const cancelAppointment = asyncHandler(async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) { res.status(404); throw new Error('Appointment not found'); }
  if (!appt.patient.equals(req.user._id) && req.user.role !== 'admin') { res.status(403); throw new Error('Not allowed'); }
  appt.status = 'cancelled';
  await appt.save();
  res.json({ appt });
});