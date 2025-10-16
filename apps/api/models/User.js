import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin', 'staff'], default: 'patient' },
  profile: { type: mongoose.Schema.Types.Mixed, default: {} },
  status: { type: String, enum: ['active','inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(plain) {
  return await bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);