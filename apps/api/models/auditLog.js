import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const AuditLogSchema = new Schema({
  actor: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    required: true, 
    enum: [
      'create:appointment',
      'update:appointment',
      'delete:appointment',
      'create:prescription',
      'update:prescription',
      'delete:prescription',
      'login',
      'logout',
      'update:profile',
      // add more actions as needed
    ]
  },
  targetModel: { type: String }, // e.g., 'Appointment', 'Prescription'
  targetId: { type: Schema.Types.ObjectId },
  ip: { type: String },
  meta: { type: Object }, // Store any extra data
}, {
  timestamps: true
});

// Indexes for faster queries
AuditLogSchema.index({ actor: 1, createdAt: -1 });
AuditLogSchema.index({ targetModel: 1, targetId: 1 });

export default model('AuditLog', AuditLogSchema);
