import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const MedicalReportSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  encounter: { type: Schema.Types.ObjectId, ref: 'Encounter' },
  title: String,
  type: String, // e.g., 'lab', 'imaging', 'discharge'
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  fileRef: { // file metadata or storage ref
    filename: String,
    url: String,
    size: Number,
    mimeType: String
  },
  summary: String,
  reportedAt: Date
}, {
  timestamps: true
});

MedicalReportSchema.index({ patient: 1, reportedAt: -1 });

export default model('MedicalReport', MedicalReportSchema);
