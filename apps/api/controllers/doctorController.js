// controllers/doctorController.js

import Doctor from "../models/doctor.js";
import User from "../models/User.js";
import { validationResult } from "express-validator";

/**
 * @desc    Get the current logged-in doctor's profile
 * @route   GET /api/doctors/me
 * @access  Private (Doctor role)
 */
export const getMyProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate("user", [
      "firstName",
      "lastName",
      "email",
    ]);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update the current logged-in doctor's profile
 * @route   PUT /api/doctors/me
 * @access  Private (Doctor role)
 */
export const updateMyProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    hospital,
    department,
    specialty,
    qualifications,
    registrationId,
    availability,
    consultationFee,
  } = req.body;

  const profileFields = {};
  if (hospital) profileFields.hospital = hospital;
  if (department) profileFields.department = department;
  if (specialty) profileFields.specialty = specialty;
  if (qualifications) profileFields.qualifications = qualifications;
  if (registrationId) profileFields.registrationId = registrationId;
  if (availability) profileFields.availability = availability;
  if (consultationFee !== undefined) profileFields.consultationFee = consultationFee;

  try {
    let doctor = await Doctor.findOne({ user: req.user.id });

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor profile not found" });
    }

    doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, runValidators: true }
    ).populate("user", ["firstName", "lastName", "email"]);

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all doctor profiles (for patients to search)
 * @route   GET /api/doctors
 * @access  Public
 */
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user", ["firstName", "lastName", "email"]);
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get a doctor profile by user ID
 * @route   GET /api/doctors/:userId
 * @access  Public
 */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.userId }).populate("user", [
      "firstName",
      "lastName",
      "email",
    ]);

    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    res.status(500).send("Server Error");
  }
};
