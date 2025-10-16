import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const EncounterSchema = new Schema({
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  startedAt: Date,
  endedAt: Date,
  vitals: {
    bp: String,
    pulse: Number,
    tempC: Number,
    respRate: Number
  },
  presentingComplaint: String,
  diagnosis: [String],
  procedures: [String],
  notes: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export default model('Encounter', EncounterSchema);
