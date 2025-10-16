import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AppointmentSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', required: false },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
  reason: { type: String },
  status: { 
    type: String,
    enum: ['requested', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'requested'
  },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, default: 30 },
  slotId: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String },
  cancellation: {
    reason: String,
    cancelledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    cancelledAt: Date
  },
  rescheduledFrom: { type: Schema.Types.ObjectId, ref: 'Appointment' }
}, {
  timestamps: true
});

// Indexes for faster queries
AppointmentSchema.index({ patient: 1, scheduledAt: 1 });
AppointmentSchema.index({ doctor: 1, scheduledAt: 1 });

export default model('Appointment', AppointmentSchema);
