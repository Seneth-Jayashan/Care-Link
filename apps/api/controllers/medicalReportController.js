// controllers/medicalReportController.js

import MedicalReport from "../models/medicalReport.js";
import Patient from "../models/patient.js";
import { validationResult } from "express-validator";

/**
 * @desc    Upload a new medical report for a patient
 * @route   POST /api/reports
 * @access  Private (Doctor, Staff, Admin roles)
 */
export const uploadReport = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ msg: "No file was uploaded." });
  }

  const { patientId, title, type, summary, encounterId } = req.body;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const newReport = new MedicalReport({
      patient: patientId,
      encounter: encounterId, // Optional: link to a specific visit
      title,
      type, // e.g., 'lab', 'imaging'
      summary,
      uploadedBy: req.user.id,
      fileRef: {
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
      reportedAt: Date.now(),
    });

    const report = await newReport.save();
    res.status(201).json(report);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all reports for a specific patient
 * @route   GET /api/reports/patient/:patientId
 * @access  Private (Doctor or the patient themselves)
 */
export const getReportsForPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // --- Authorization ---
    const isOwnerPatient = req.user.role === "patient" && patient.user.equals(req.user.id);
    const isPrivilegedRole = ["doctor", "admin", "staff"].includes(req.user.role);

    if (!isOwnerPatient && !isPrivilegedRole) {
      return res
        .status(403)
        .json({ msg: "Forbidden: You are not authorized to view these reports." });
    }

    const reports = await MedicalReport.find({ patient: req.params.patientId })
      .populate("uploadedBy", ["firstName", "lastName"])
      .sort({ reportedAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
