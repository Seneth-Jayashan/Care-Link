import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const NotificationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  body: String,
  data: { type: Object },
  read: { type: Boolean, default: false },
  channel: { type: String, enum: ['app','sms','email','push'], default: 'app' },
  sentAt: Date
}, {
  timestamps: true
});

export default model('Notification', NotificationSchema);
