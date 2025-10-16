// src/pages/patient/booking-steps/SelectTimeSlot.jsx

import React from 'react';
import { motion } from 'framer-motion';

const SelectTimeSlot = ({ doctorId, bookingDetails, setBookingDetails, setStep }) => {
  // In a real app, you would fetch available slots based on the selected date
  const availableSlots = ['09:00 AM', '09:30 AM', '11:00 AM', '02:00 PM'];

  const handleSelectSlot = (slot) => {
    setBookingDetails(prev => ({ ...prev, selectedSlot: slot }));
    setStep(2); // Move to the next step
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-care-dark mb-4">Book Appointment</h1>
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <p className="font-semibold text-lg">You are booking with:</p>
        <h2 className="text-2xl font-bold text-care-primary">{bookingDetails.doctor?.name}</h2>
        <p className="text-gray-500">{bookingDetails.doctor?.specialty}</p>
        
        <div className="mt-6">
          <label className="font-semibold text-gray-700">Select Date</label>
          <input type="date" className="w-full mt-1 p-3 border border-gray-300 rounded-lg" />
        </div>
        
        <div className="mt-6">
          <p className="font-semibold text-gray-700 mb-2">Available Time Slots</p>
          <div className="grid grid-cols-3 gap-4">
            {availableSlots.map(slot => (
              <motion.button 
                key={slot} 
                onClick={() => handleSelectSlot(slot)}
                className="p-3 border border-care-primary text-care-primary font-semibold rounded-lg hover:bg-care-primary hover:text-white"
                whileTap={{ scale: 0.95 }}
              >
                {slot}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SelectTimeSlot;