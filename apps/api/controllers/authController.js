// controllers/authController.js

import User from "../models/User.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

/**
 * @desc    Register a new user and their corresponding profile (Patient/Doctor)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, role, phone } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "User with this email already exists" }] });
    }

    user = new User({
      firstName,
      lastName,
      email,
      phone,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    if (role === "patient") {
      const patientProfile = new Patient({ user: user._id });
      await patientProfile.save();
      user.patientProfile = patientProfile._id;
    } else if (role === "doctor") {
      const doctorProfile = new Doctor({ user: user._id });
      await doctorProfile.save();
      user.doctorProfile = doctorProfile._id;
    }

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    user.lastLoginAt = Date.now();
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

/**
 * @desc    Get the logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private (Requires a token)
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-passwordHash")
      .populate("patientProfile")
      .populate("doctorProfile");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
