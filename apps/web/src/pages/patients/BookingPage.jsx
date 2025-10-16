// src/pages/patient/BookingPage.jsx (Parent Component)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Import child components for each step
import SelectTimeSlot from './booking-steps/SelectTimeSlot';
import PatientDetails from './booking-steps/PatientDetails';
import PaymentProcess from './booking-steps/PaymentProcess';
import BookingConfirmation from './booking-steps/BookingConfirmation';

const BookingPage = () => {
  const { doctorId } = useParams(); // Get the doctor's ID from the URL

  // State to manage the current step of the wizard
  const [step, setStep] = useState(1); // 1: Time, 2: Details, 3: Payment, 4: Confirmation

  // State to hold all booking information
  const [bookingDetails, setBookingDetails] = useState({
    doctor: null, // Will be fetched
    selectedSlot: null,
    reasonForVisit: '',
    appointmentId: null, // From our backend after initiating
    paymentStatus: 'pending',
  });

  useEffect(() => {
    // Fetch doctor details when the component mounts
    const fetchDoctor = async () => {
      // const res = await api.get(`/doctors/${doctorId}`);
      // setBookingDetails(prev => ({ ...prev, doctor: res.data }));
      // Using mock data for now:
      setBookingDetails(prev => ({ ...prev, doctor: { name: 'Dr. Nimali Silva', fee: 5000, specialty: 'Cardiologist' } }));
    };
    fetchDoctor();
  }, [doctorId]);

  // Render the component for the current step
  switch (step) {
    case 1:
      return <SelectTimeSlot doctorId={doctorId} bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} setStep={setStep} />;
    case 2:
      return <PatientDetails bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} setStep={setStep} />;
    case 3:
      return <PaymentProcess bookingDetails={bookingDetails} setBookingDetails={setBookingDetails} setStep={setStep} />;
    case 4:
      return <BookingConfirmation bookingDetails={bookingDetails} />;
    default:
      return <div>An error occurred.</div>;
  }
};

export default BookingPage;