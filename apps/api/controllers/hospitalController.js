// controllers/hospitalController.js

import Hospital from "../models/hospital.js";
import { validationResult } from "express-validator";

/**
 * @desc    Create a new hospital
 * @route   POST /api/hospitals
 * @access  Private (Admin role)
 */
export const createHospital = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, code, address, phone, email, departments } = req.body;

  try {
    let hospital = await Hospital.findOne({ code });
    if (hospital) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Hospital with this code already exists" }] });
    }

    hospital = new Hospital({
      name,
      code,
      address,
      phone,
      email,
      departments,
    });

    await hospital.save();
    res.status(201).json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all hospitals
 * @route   GET /api/hospitals
 * @access  Public
 */
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find().sort({ name: 1 });
    res.json(hospitals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Update a hospital by ID
 * @route   PUT /api/hospitals/:id
 * @access  Private (Admin role)
 */
export const updateHospital = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ msg: "Hospital not found" });
    }

    hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(hospital);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
