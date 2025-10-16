import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PatientSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  nhsNumber: { type: String, index: true }, // or national id
  dob: { type: Date },
  gender: { type: String, enum: ['male','female','other','unknown'], default: 'unknown' },
  address: {
    line1: String,
    line2: String,
    city: String,
    postalCode: String,
    country: String
  },
  emergencyContacts: [{
    name: String,
    relation: String,
    phone: String
  }],
  allergies: [{ type: String }],
  chronicConditions: [{ type: String }],
  primaryDoctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  insurance: {
    provider: String,
    policyNumber: String,
    validUntil: Date
  },
  metadata: { type: Object }
}, {
  timestamps: true
});

export default model('Patient', PatientSchema);
