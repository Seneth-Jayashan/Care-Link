// src/pages/patient/booking-steps/PaymentProcess.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const PaymentProcess = ({ bookingDetails, setBookingDetails, setStep }) => {
  const [paymentState, setPaymentState] = useState('pending'); // pending -> processing -> success/failed

  useEffect(() => {
    // 1. Initiate the appointment with your backend
    const initiate = async () => {
      // const res = await api.post('/appointments/initiate', { ... });
      // setBookingDetails(prev => ({ ...prev, appointmentId: res.data.appointmentId }));
      // 2. Use the response to call the payment gateway (Stripe, etc.)
      
      // Simulating the process
      setPaymentState('processing');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 3. Based on gateway response, update state
      setPaymentState('success');
      setBookingDetails(prev => ({ ...prev, paymentStatus: 'success' }));
      
      // 4. Move to the final confirmation step
      setTimeout(() => setStep(4), 1000);
    };
    initiate();
  }, [setStep, setBookingDetails]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
      <div className="bg-white p-12 rounded-2xl shadow-lg inline-block">
        {paymentState === 'processing' && <p className="text-xl font-semibold">Processing Payment...</p>}
        {paymentState === 'success' && <p className="text-xl font-semibold text-green-600">Payment Successful!</p>}
        {paymentState === 'failed' && <p className="text-xl font-semibold text-red-600">Payment Failed. Please try again.</p>}
        <p className="mt-2 text-gray-500">Amount: LKR {bookingDetails.doctor?.fee}</p>
      </div>
    </motion.div>
  );
};

export default PaymentProcess;