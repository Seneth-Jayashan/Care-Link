import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MedicationSchema = new Schema({
  name: { type: String, required: true },
  brand: String,
  code: String,
  strength: String,
  form: String, // tablet, syrup, injection
  manufacturer: String,
  unitPrice: Number,
  metadata: { type: Object }
}, {
  timestamps: true
});

export default model('Medication', MedicationSchema);
