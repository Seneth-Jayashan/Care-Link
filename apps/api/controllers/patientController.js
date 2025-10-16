// controllers/patientController.js

import Patient from "../models/patient.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

/**
 * @desc    Get the current logged-in patient's profile
 * @route   GET /api/patients/me
 * @access  Private (Patient role)
 */
export const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate("user", [
      "firstName",
      "lastName",
      "email",
    ]);

    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update the current logged-in patient's profile
 * @route   PUT /api/patients/me
 * @access  Private (Patient role)
 */
export const updateMyProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    nhsNumber,
    dob,
    gender,
    address,
    emergencyContacts,
    allergies,
    chronicConditions,
    insurance,
  } = req.body;

  const profileFields = {};
  if (nhsNumber) profileFields.nhsNumber = nhsNumber;
  if (dob) profileFields.dob = dob;
  if (gender) profileFields.gender = gender;
  if (address) profileFields.address = address;
  if (emergencyContacts) profileFields.emergencyContacts = emergencyContacts;
  if (allergies) profileFields.allergies = allergies;
  if (chronicConditions) profileFields.chronicConditions = chronicConditions;
  if (insurance) profileFields.insurance = insurance;

  try {
    let patient = await Patient.findOne({ user: req.user.id });

    if (!patient) {
      return res.status(404).json({ msg: "Patient profile not found" });
    }

    patient = await Patient.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, runValidators: true }
    ).populate("user", ["firstName", "lastName", "email"]);

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get a patient profile by user ID (for Admins/Doctors)
 * @route   GET /api/patients/:userId
 * @access  Private (Admin, Doctor roles)
 */
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.userId }).populate("user", [
      "firstName",
      "lastName",
      "email",
      "phone",
    ]);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Patient not found" });
    }
    res.status(500).send("Server Error");
  }
};
