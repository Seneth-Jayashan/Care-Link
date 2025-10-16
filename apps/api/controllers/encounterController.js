// controllers/encounterController.js

import Encounter from "../models/encounter.js";
import Appointment from "../models/Appointment.js";
import { validationResult } from "express-validator";

/**
 * @desc    Create a new encounter record for an appointment
 * @route   POST /api/encounters
 * @access  Private (Doctor role)
 */
export const createEncounter = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { appointmentId, vitals, presentingComplaint, diagnosis, procedures, notes } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    // Authorization: Ensure logged-in doctor is the doctor on the appointment
    if (!appointment.doctor.equals(req.user.id)) {
      return res.status(403).json({ msg: "User not authorized for this appointment" });
    }

    const newEncounter = new Encounter({
      appointment: appointmentId,
      patient: appointment.patient,
      doctor: appointment.doctor,
      startedAt: appointment.scheduledAt, // Or Date.now()
      vitals,
      presentingComplaint,
      diagnosis,
      procedures,
      notes,
      createdBy: req.user.id,
    });

    const encounter = await newEncounter.save();

    // Optionally, update the appointment status to 'completed'
    appointment.status = "completed";
    await appointment.save();

    res.status(201).json(encounter);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all encounters for a specific patient
 * @route   GET /api/encounters/patient/:patientId
 * @access  Private (Doctor or the patient themselves)
 */
export const getEncountersForPatient = async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Authorization check should verify that logged-in user is patient or their doctor

    const encounters = await Encounter.find({ patient: patientId })
      .populate("doctor", "specialty")
      .populate({
        path: "doctor",
        populate: { path: "user", select: "firstName lastName" },
      })
      .sort({ createdAt: -1 });

    if (!encounters || encounters.length === 0) {
      return res.status(404).json({ msg: "No encounters found for this patient" });
    }

    res.json(encounters);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
