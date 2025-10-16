// controllers/paymentController.js

import Payment from "../models/payment.js";
import Appointment from "../models/Appointment.js";
import Patient from "../models/patient.js";
import { validationResult } from "express-validator";

/**
 * @desc    Initiate a payment for an appointment
 * @route   POST /api/payments/initiate
 * @access  Private (Patient role)
 */
export const initiateAppointmentPayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { appointmentId, amount, method } = req.body;

  try {
    const patient = await Patient.findOne({ user: req.user.id });
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ msg: "Appointment not found" });
    }

    if (!appointment.patient.equals(patient._id)) {
      return res
        .status(403)
        .json({ msg: "Forbidden: Appointment does not belong to this patient" });
    }

    let existingPayment = await Payment.findOne({ appointment: appointmentId });
    if (existingPayment && existingPayment.status === "success") {
      return res
        .status(400)
        .json({ msg: "Payment has already been successfully made for this appointment." });
    }

    const newPayment = new Payment({
      payer: req.user.id,
      patient: patient._id,
      appointment: appointmentId,
      amount,
      currency: "LKR",
      method,
      status: "initiated",
    });

    await newPayment.save();

    res.status(201).json({
      msg: "Payment initiated successfully.",
      paymentId: newPayment._id,
      // Include payment gateway info here in a real app
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Manually confirm a payment (for Admin/Staff)
 * @route   POST /api/payments/:paymentId/confirm
 * @access  Private (Admin, Staff roles)
 */
export const confirmPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);

    if (!payment) {
      return res.status(404).json({ msg: "Payment record not found" });
    }

    payment.status = "success";
    payment.paidAt = Date.now();
    payment.providerReference = `MANUAL_CONFIRM_${req.user.id}_${Date.now()}`;

    await payment.save();

    res.json({ msg: "Payment confirmed successfully", payment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get the payment history for the logged-in user
 * @route   GET /api/payments/my-history
 * @access  Private (Patient role)
 */
export const getMyPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ payer: req.user.id })
      .populate({
        path: "appointment",
        select: "scheduledAt reason",
        populate: {
          path: "doctor",
          select: "specialty",
          populate: { path: "user", select: "firstName lastName" },
        },
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
