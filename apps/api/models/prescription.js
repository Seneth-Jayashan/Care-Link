import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PrescriptionSchema = new Schema({
  encounter: { type: Schema.Types.ObjectId, ref: 'Encounter' },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  medications: [
    {
      medication: { type: Schema.Types.ObjectId, ref: 'Medication' },
      name: String,
      dosage: String,
      route: String,
      frequency: String,
      durationDays: Number,
      instructions: String
    }
  ],
  notes: String,
  status: { type: String, enum: ['active','fulfilled','cancelled'], default: 'active' },
  fulfilledAt: Date,
  fulfilledBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export default model('Prescription', PrescriptionSchema);
