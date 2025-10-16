// controllers/prescriptionController.js

import Prescription from "../models/prescription.js";
import Encounter from "../models/encounter.js";
import Patient from "../models/patient.js";
import { validationResult } from "express-validator";

/**
 * @desc    Create a new prescription for an encounter
 * @route   POST /api/prescriptions
 * @access  Private (Doctor role)
 */
export const createPrescription = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { encounterId, medications, notes } = req.body;

  try {
    const encounter = await Encounter.findById(encounterId);
    if (!encounter) {
      return res.status(404).json({ msg: "Encounter not found" });
    }

    if (!encounter.doctor.equals(req.user.id)) {
      return res
        .status(403)
        .json({ msg: "User not authorized to create a prescription for this encounter" });
    }

    const newPrescription = new Prescription({
      encounter: encounterId,
      patient: encounter.patient,
      doctor: encounter.doctor,
      medications,
      notes,
    });

    const prescription = await newPrescription.save();
    res.status(201).json(prescription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all prescriptions for the logged-in patient
 * @route   GET /api/prescriptions/my
 * @access  Private (Patient role)
 */
export const getMyPrescriptions = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found." });
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate({
        path: "doctor",
        select: "specialty",
        populate: { path: "user", select: "firstName lastName" },
      })
      .populate("medications.medication") // Populate medication details
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
