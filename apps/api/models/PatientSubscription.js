import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PatientSubscriptionSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
  plan: { type: Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  autoRenew: { type: Boolean, default: true },
  paymentInfo: { // Reference to payment details for this subscription
    lastPaymentDate: Date,
    nextPaymentDate: Date,
    paymentId: String // e.g., Stripe subscription ID
  }
}, {
  timestamps: true
});

export default model('PatientSubscription', PatientSubscriptionSchema);
