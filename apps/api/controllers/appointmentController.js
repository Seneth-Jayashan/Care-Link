// controllers/appointmentController.js

import Appointment from "../models/Appointment.js";
import Doctor from "../models/doctor.js";
import Patient from "../models/patient.js";
import { validationResult } from "express-validator";

/**
 * @desc    Create a new appointment
 * @route   POST /api/appointments
 * @access  Private (Patient role)
 */
export const createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { doctorId, scheduledAt, reason } = req.body;

  try {
    // Find the patient profile for the logged-in user
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res
        .status(404)
        .json({ msg: "Patient profile not found. Cannot book appointment." });
    }

    // TODO: Add logic here to check doctor availability
    const newAppointment = new Appointment({
      patient: patient._id,
      doctor: doctorId,
      scheduledAt,
      reason,
      createdBy: req.user.id,
      status: "requested", // Appointments start as 'requested'
    });

    const appointment = await newAppointment.save();

    // TODO: Add a notification for the doctor about the new request.
    res.status(201).json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get appointments for the logged-in user (Patient or Doctor)
 * @route   GET /api/appointments/my
 * @access  Private
 */
export const getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      const patient = await Patient.findOne({ user: req.user.id });
      appointments = await Appointment.find({ patient: patient._id })
        .populate("doctor", "specialty")
        .populate({
          path: "doctor",
          populate: { path: "user", select: "firstName lastName" },
        })
        .sort({ scheduledAt: -1 });
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user.id });
      appointments = await Appointment.find({ doctor: doctor._id })
        .populate("patient")
        .populate({
          path: "patient",
          populate: { path: "user", select: "firstName lastName" },
        })
        .sort({ scheduledAt: -1 });
    } else {
      return res
        .status(403)
        .json({ msg: "User role not authorized to view appointments" });
    }

    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update an appointment's status (e.g., confirm, cancel)
 * @route   PATCH /api/appointments/:id/status
 * @access  Private
 */
export const updateAppointmentStatus = async (req, res) => {
  const { status, cancellationReason } = req.body;
  const { id } = req.params;

  const allowedStatus = ["confirmed", "cancelled", "completed"];
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ msg: "Invalid status update." });
  }

  try {
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // --- Authorization Logic ---
    const patient = await Patient.findOne({ user: req.user.id });
    const isOwnerPatient = patient && appointment.patient.equals(patient._id);
    const isOwnerDoctor =
      req.user.role === "doctor" && appointment.doctor.equals(req.user.id);

    // Doctor can confirm or complete an appointment
    if (status === "confirmed" || status === "completed") {
      if (!isOwnerDoctor) {
        return res
          .status(403)
          .json({ msg: "User not authorized to confirm this appointment" });
      }
    }

    // Patient or Doctor can cancel
    if (status === "cancelled") {
      if (!isOwnerPatient && !isOwnerDoctor) {
        return res
          .status(403)
          .json({ msg: "User not authorized to cancel this appointment" });
      }
      appointment.cancellation = {
        reason: cancellationReason || "Cancelled by user",
        cancelledBy: req.user.id,
        cancelledAt: Date.now(),
      };
    }

    appointment.status = status;
    await appointment.save();

    // TODO: Send notification to the other party about the status change.
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
