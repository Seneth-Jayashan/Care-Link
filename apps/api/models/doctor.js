import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DoctorSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospital: { type: Schema.Types.ObjectId, ref: 'Hospital' },
  department: { type: String },
  specialty: { type: String },
  qualifications: [String],
  registrationId: { type: String, index: true }, // medical council id
  availability: [{
    dayOfWeek: { type: Number }, // 0..6
    from: { type: String }, // "09:00"
    to: { type: String } // "13:00"
  }],
  consultationFee: { type: Number, default: 0 },
  metadata: { type: Object }
}, {
  timestamps: true
});

export default model('Doctor', DoctorSchema);
