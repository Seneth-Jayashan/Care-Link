// src/pages/patient/booking-steps/BookingConfirmation.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const BookingConfirmation = ({ bookingDetails }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto text-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <FiCheckCircle className="mx-auto text-7xl text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-care-dark">Appointment Confirmed!</h1>
        <p className="text-lg text-gray-600 mt-2">Your booking has been successfully made.</p>
        
        <div className="text-left bg-care-light p-6 rounded-lg mt-8 space-y-2">
            <p><strong>Doctor:</strong> {bookingDetails.doctor?.name}</p>
            <p><strong>Specialty:</strong> {bookingDetails.doctor?.specialty}</p>
            <p><strong>Date & Time:</strong> {bookingDetails.selectedSlot} on {new Date().toLocaleDateString('en-LK')}</p>
            <p><strong>Reason:</strong> {bookingDetails.reasonForVisit || 'Not specified'}</p>
        </div>

        <Link to="/patient/appointments">
            <motion.button className="w-full mt-8 bg-care-primary text-white font-bold py-3 rounded-lg" whileTap={{ scale: 0.98 }}>
                View All Appointments
            </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default BookingConfirmation;