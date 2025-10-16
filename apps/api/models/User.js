import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String },
  phone: { type: String, index: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { 
    type: String, 
    enum: ['patient', 'doctor', 'hcprovider', 'admin', 'hcmanager', 'staff'], 
    required: true 
  },
  // For quick profile lookups without extra queries
  patientProfile: { type: Schema.Types.ObjectId, ref: 'Patient' },
  doctorProfile: { type: Schema.Types.ObjectId, ref: 'Doctor' },
  active: { type: Boolean, default: true },
  lastLoginAt: { type: Date },
  meta: { type: Object },
}, {
  timestamps: true
});

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

export default model('User', UserSchema);
