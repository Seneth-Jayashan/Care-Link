import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PharmacyOrderSchema = new Schema({
  prescription: { type: Schema.Types.ObjectId, ref: 'Prescription' },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  pharmacy: { type: Schema.Types.ObjectId, ref: 'Pharmacy' },
  items: [
    {
      medication: { type: Schema.Types.ObjectId, ref: 'Medication' },
      name: String,
      qty: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  status: { 
    type: String, 
    enum: ['pending','processing','ready','dispatched','completed','cancelled'], 
    default: 'pending' 
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  notes: String
}, {
  timestamps: true
});

export default model('PharmacyOrder', PharmacyOrderSchema);
