// src/pages/patient/Appointment.jsx

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiPlus, FiX } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext'; // Adjust path as needed
// import api from '../../api/api'; // Your configured Axios instance

// --- Mock Data (replace with API calls) ---
const mockDoctors = [
  { _id: 'doc1', user: { firstName: 'Nimali', lastName: 'Silva' }, specialty: 'Cardiologist' },
  { _id: 'doc2', user: { firstName: 'Saman', lastName: 'Perera' }, specialty: 'Dermatologist' },
  { _id: 'doc3', user: { firstName: 'Priya', lastName: 'Fernando' }, specialty: 'Pediatrician' },
];

const mockAppointments = [
  { _id: 'appt1', doctor: mockDoctors[0], scheduledAt: '2025-10-28T10:00:00.000Z', status: 'confirmed', reason: 'Annual Checkup' },
  { _id: 'appt2', doctor: mockDoctors[1], scheduledAt: '2025-11-05T14:30:00.000Z', status: 'confirmed', reason: 'Skin Rash' },
  { _id: 'appt3', doctor: mockDoctors[2], scheduledAt: '2025-09-15T09:00:00.000Z', status: 'completed', reason: 'Vaccination' },
];

// --- Reusable Components & Variants ---

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    requested: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AppointmentCard = ({ appointment }) => (
  <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-md border border-gray-200/80">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xl font-bold text-care-dark">Dr. {appointment.doctor.user.firstName} {appointment.doctor.user.lastName}</h3>
        <p className="text-gray-500">{appointment.doctor.specialty}</p>
      </div>
      <StatusBadge status={appointment.status} />
    </div>
    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
      <div className="flex items-center text-gray-600 mb-2">
        <FiCalendar className="mr-3 text-care-primary" />
        <span>{new Date(appointment.scheduledAt).toLocaleDateString('en-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
      <div className="flex items-center text-gray-600">
        <FiClock className="mr-3 text-care-primary" />
        <span>{new Date(appointment.scheduledAt).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
    {appointment.status === 'confirmed' && (
       <div className="mt-4 flex gap-2">
         <button className="text-sm font-semibold text-red-600 hover:text-red-800">Cancel</button>
       </div>
    )}
  </motion.div>
);


// --- Main Appointment Page Component ---

const Appointment = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showModal, setShowModal] = useState(false);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // In a real app, you would fetch this data from your API
      // const apptRes = await api.get('/appointments/my');
      // const docRes = await api.get('/doctors');
      // setAppointments(apptRes.data);
      // setDoctors(docRes.data);
      setAppointments(mockAppointments);
      setDoctors(mockDoctors);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'confirmed' || a.status === 'requested');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-care-dark">Appointments</h1>
        
      </div>

      {/* --- Appointment List --- */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80">
        <div className="flex border-b border-gray-200">
          <button onClick={() => setActiveTab('upcoming')} className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'upcoming' ? 'text-care-primary border-b-2 border-care-primary' : 'text-gray-500'}`}>
            Upcoming ({upcomingAppointments.length})
          </button>
          <button onClick={() => setActiveTab('past')} className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'past' ? 'text-care-primary border-b-2 border-care-primary' : 'text-gray-500'}`}>
            Past ({pastAppointments.length})
          </button>
        </div>
        
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map(appt => (
                <AppointmentCard key={appt._id} appointment={appt} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Booking Modal --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-care-dark">Book an Appointment</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
              </div>
              <form className="space-y-4">
                <div>
                  <label className="font-semibold text-gray-700">Select Doctor</label>
                  <select className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none">
                    <option>Choose a doctor...</option>
                    {doctors.map(doc => (
                       <option key={doc._id} value={doc._id}>Dr. {doc.user.firstName} {doc.user.lastName} ({doc.specialty})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-gray-700">Date</label>
                    <input type="date" className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none" />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-700">Time</label>
                    <input type="time" className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-gray-700">Reason for Visit</label>
                  <textarea rows="3" placeholder="e.g., Annual Checkup, fever..." className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none"></textarea>
                </div>
                <div className="pt-4 flex justify-end">
                   <motion.button type="submit" className="bg-care-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-care-dark" whileTap={{ scale: 0.95 }}>
                    Request Appointment
                   </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Appointment;