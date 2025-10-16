import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PaymentSchema = new Schema({
  payer: { type: Schema.Types.ObjectId, ref: 'User' },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  pharmacyOrder: { type: Schema.Types.ObjectId, ref: 'PharmacyOrder' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'LKR' },
  method: { type: String, enum: ['card','cash','insurance','online','wallet'] },
  status: { type: String, enum: ['initiated','success','failed','refunded'], default: 'initiated' },
  providerReference: String,
  paidAt: Date,
  metadata: { type: Object }
}, {
  timestamps: true
});

export default model('Payment', PaymentSchema);
