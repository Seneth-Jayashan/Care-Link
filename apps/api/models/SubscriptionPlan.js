import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const SubscriptionPlanSchema = new Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Basic Wellness", "Family Plus"
  description: { type: String },
  price: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  billingCycle: { type: String, enum: ['monthly', 'annually'], required: true },
  features: [String], // List of features like "10 Free Consultations"
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default model('SubscriptionPlan', SubscriptionPlanSchema);
