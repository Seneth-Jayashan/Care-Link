// controllers/subscriptionController.js

import SubscriptionPlan from "../models/SubscriptionPlan.js";
import PatientSubscription from "../models/PatientSubscription.js";
import Patient from "../models/patient.js";
import { validationResult } from "express-validator";
import { addMonths, addYears } from "date-fns";

// --- ADMIN FUNCTIONS ---

/**
 * @desc    Create a new subscription plan
 * @route   POST /api/subscriptions/plans
 * @access  Private (Admin role)
 */
export const createPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const plan = new SubscriptionPlan(req.body);
    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get all available subscription plans
 * @route   GET /api/subscriptions/plans
 * @access  Public
 */
export const getAllPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find({ active: true });
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// --- PATIENT FUNCTIONS ---

/**
 * @desc    Subscribe the logged-in patient to a plan
 * @route   POST /api/subscriptions/subscribe
 * @access  Private (Patient role)
 */
export const subscribeToPlan = async (req, res) => {
  const { planId } = req.body;

  try {
    const patient = await Patient.findOne({ user: req.user.id });
    const plan = await SubscriptionPlan.findById(planId);

    if (!patient || !plan) {
      return res.status(404).json({ msg: "Patient profile or plan not found" });
    }

    const existingSub = await PatientSubscription.findOne({ patient: patient._id, status: "active" });
    if (existingSub) {
      return res.status(400).json({ msg: "Patient already has an active subscription." });
    }

    const startDate = new Date();
    let endDate;
    if (plan.billingCycle === "monthly") endDate = addMonths(startDate, 1);
    else if (plan.billingCycle === "annually") endDate = addYears(startDate, 1);

    const newSubscription = new PatientSubscription({
      patient: patient._id,
      plan: planId,
      startDate,
      endDate,
      status: "active",
    });

    await newSubscription.save();
    res.status(201).json({ msg: "Successfully subscribed to plan.", subscription: newSubscription });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Get the logged-in patient's current subscription
 * @route   GET /api/subscriptions/my-subscription
 * @access  Private (Patient role)
 */
export const getMySubscription = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    const subscription = await PatientSubscription.findOne({ patient: patient._id }).populate("plan");

    if (!subscription) {
      return res.status(404).json({ msg: "No active subscription found." });
    }
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

/**
 * @desc    Cancel the logged-in patient's subscription
 * @route   PATCH /api/subscriptions/my-subscription/cancel
 * @access  Private (Patient role)
 */
export const cancelSubscription = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id });
    const subscription = await PatientSubscription.findOne({ patient: patient._id, status: "active" });

    if (!subscription) {
      return res.status(404).json({ msg: "No active subscription to cancel." });
    }

    subscription.status = "cancelled";
    subscription.autoRenew = false;

    await subscription.save();
    res.json({ msg: "Subscription has been cancelled successfully.", subscription });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
