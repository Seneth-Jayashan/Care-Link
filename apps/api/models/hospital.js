import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const HospitalSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  address: {
    line1: String,
    line2: String,
    city: String,
    postalCode: String,
    country: String
  },
  phone: String,
  email: String,
  departments: [{ name: String, code: String }],
  metadata: { type: Object }
}, {
  timestamps: true
});

export default model('Hospital', HospitalSchema);
