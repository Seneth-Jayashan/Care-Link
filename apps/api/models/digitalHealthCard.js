import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DigitalHealthCardSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true, unique: true },
  cardId: { type: String, unique: true, required: true },
  issuedAt: { type: Date, default: Date.now },
  expiresAt: Date,
  data: {
    bloodGroup: String,
    allergies: [String],
    emergencyContact: { name: String, phone: String },
    summary: String
  },
  qrPayload: String, // optional cached QR string or URL
  accessControl: { type: String, enum: ['public','restricted','private'], default: 'restricted' }
}, {
  timestamps: true
});

export default model('DigitalHealthCard', DigitalHealthCardSchema);
