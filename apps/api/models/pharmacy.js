import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PharmacySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // if pharmacy has login
  name: { type: String, required: true },
  address: { line1: String, city: String, postalCode: String, country: String },
  phone: String,
  email: String,
  inventory: [
    { 
      medication: { type: Schema.Types.ObjectId, ref: 'Medication' }, 
      qty: Number 
    }
  ],
  metadata: { type: Object }
}, {
  timestamps: true
});

export default model('Pharmacy', PharmacySchema);
