// src/pages/patient/booking-steps/PatientDetails.jsx

import React from 'react';
import { motion } from 'framer-motion';

const PatientDetails = ({ bookingDetails, setBookingDetails, setStep }) => {
  // User details would come from AuthContext in a real app
  const user = { name: 'Anura Perera', phone: '0771234567' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Move to payment
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-care-dark mb-4">Confirm Your Details</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        {/* Display a summary of the selection */}
        <div className="mb-6 pb-4 border-b">
          <p><strong>Doctor:</strong> {bookingDetails.doctor?.name}</p>
          <p><strong>Time:</strong> {bookingDetails.selectedSlot}</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Pre-filled user details */}
          <p><strong>Patient:</strong> {user.name}</p>
          <p className="mb-4"><strong>Contact:</strong> {user.phone}</p>

          <div>
            <label className="font-semibold text-gray-700">Reason for Visit (Optional)</label>
            <textarea 
              rows="4"
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
              onChange={(e) => setBookingDetails(prev => ({...prev, reasonForVisit: e.target.value}))}
            />
          </div>
          <motion.button type="submit" className="w-full mt-6 bg-care-primary text-white font-bold py-3 rounded-lg" whileTap={{ scale: 0.98 }}>
            Proceed to Payment
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default PatientDetails;