import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ReviewSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  appointment: { type: Schema.Types.ObjectId, ref: 'Appointment' }, // Context for the review
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  isAnonymous: { type: Boolean, default: false },
  // Admin can mark a review as featured or addressed
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, {
  timestamps: true
});

// Ensure one review per patient per appointment
ReviewSchema.index({ doctor: 1, patient: 1, appointment: 1 }, { unique: true });

export default model('Review', ReviewSchema);
