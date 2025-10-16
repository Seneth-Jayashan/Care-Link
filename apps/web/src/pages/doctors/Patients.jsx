// src/pages/doctor/Patients.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiFilter, FiCheckCircle } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';

// --- Mock Data (Replace with API calls from your backend) ---
const mockAppointments = [
  {
    _id: 'app1',
    date: '2025-10-16T10:00:00.000Z', // Today (assuming current date is 2025-10-16)
    status: 'booked',
    patient: { 
      user: { firstName: 'Kamala', lastName: 'Ranaweera', phone: '0778881234' }, 
      nhsNumber: 'N123456', 
      allergies: ['Dust'],
    },
    reason: 'Routine Check-up',
  },
  {
    _id: 'app2',
    date: '2025-10-16T14:30:00.000Z', // Today
    status: 'completed',
    patient: { 
      user: { firstName: 'Sunil', lastName: 'Perera', phone: '0719995678' }, 
      nhsNumber: 'N789012', 
      allergies: ['Peanuts', 'Penicillin'],
    },
    reason: 'Follow-up on X-Ray',
  },
  {
    _id: 'app3',
    date: '2025-10-17T09:00:00.000Z', // Tomorrow
    status: 'booked',
    patient: { 
      user: { firstName: 'Amali', lastName: 'Fernando', phone: '0701112223' }, 
      nhsNumber: 'N345678', 
      allergies: [],
    },
    reason: 'New Patient Consultation',
  },
  {
    _id: 'app4',
    date: '2025-10-15T11:30:00.000Z', // Yesterday
    status: 'cancelled',
    patient: { 
      user: { firstName: 'Nimal', lastName: 'Silva', phone: '0770001112' }, 
      nhsNumber: 'N901234', 
      allergies: ['Latex'],
    },
    reason: 'Annual Physical',
  },
];

// --- Reusable Components ---

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const TableRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-100">
        {[...Array(5)].map((_, i) => (
            <td key={i} className="p-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
        ))}
    </tr>
);

// --- Main Patients List Component ---
export default function Patients() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterToday, setFilterToday] = useState(true); // Default to viewing today's patients

    // 1. Fetch Appointments (Simulated)
    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000)); 
                
                // Assuming the API returns appointments associated with the logged-in doctor
                setAppointments(mockAppointments);

            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setIsLoading(false); 
            }
        };
        fetchAppointments();
    }, []);

    // 2. Filter Appointments based on state
    const filteredAppointments = useMemo(() => {
        if (!filterToday) {
            return appointments;
        }

        const today = new Date().toLocaleDateString();
        
        return appointments.filter(app => {
            const appDate = new Date(app.date).toLocaleDateString();
            return appDate === today;
        });
    }, [appointments, filterToday]);

    // 3. Helper for formatting
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-care-dark mb-4 flex items-center gap-3">
                <FaUserMd className="text-care-primary" /> My Patients List
            </h1>
            <p className="text-gray-500 mb-8">
                Appointments booked with you are listed below. Use this to track your schedule.
            </p>

            {/* Filter and Controls */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <FiFilter className="text-care-primary" size={20} />
                    <button
                        onClick={() => setFilterToday(prev => !prev)}
                        className={`px-4 py-2 rounded-full font-semibold transition-colors flex items-center gap-2
                            ${filterToday 
                                ? 'bg-care-primary text-white shadow-md' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {filterToday ? <FiCheckCircle /> : <FiCalendar />}
                        {filterToday ? "Showing Today's Patients" : "View All Appointments"}
                    </button>
                </div>
                <p className="text-sm text-gray-500">
                    Total Appointments: **{filteredAppointments.length}**
                </p>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-care-light border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Patient</th>
                                <th className="p-4 font-semibold text-gray-600">Date & Time</th>
                                <th className="p-4 font-semibold text-gray-600">Reason</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Contact / Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                // Loading Skeletons
                                [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
                            ) : filteredAppointments.length > 0 ? (
                                // Mapped Patient Rows
                                filteredAppointments.map((app, index) => (
                                    <motion.tr 
                                        key={app._id} 
                                        variants={itemVariants} 
                                        initial="hidden" 
                                        animate="visible" 
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="p-4 font-medium text-gray-800">
                                            <div className="text-lg">
                                                {app.patient.user.firstName} {app.patient.user.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                NHS ID: {app.patient.nhsNumber}
                                            </div>
                                            {app.patient.allergies.length > 0 && (
                                                <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded mt-1 inline-block">
                                                    Allergies: {app.patient.allergies.join(', ')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar size={14} className="text-care-primary" />
                                                {new Date(app.date).toLocaleDateString('en-LK')}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <FiClock size={14} className="text-care-primary" />
                                                {formatTime(app.date)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600">{app.reason}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full 
                                                ${app.status === 'booked' ? 'bg-blue-100 text-blue-800' : 
                                                  app.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                                  'bg-red-100 text-red-800'}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <a href={`tel:${app.patient.user.phone}`} className="text-care-primary hover:underline text-sm">
                                                Call: {app.patient.user.phone}
                                            </a>
                                            <motion.button 
                                                className="mt-2 text-xs text-gray-500 hover:text-care-dark block"
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => alert(`Navigating to patient details for ${app.patient.user.firstName}...`)}
                                            >
                                                View Patient Chart
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                // Empty State
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        <div className="text-xl font-semibold">
                                            No patients found {filterToday ? "for today's date." : "in your history."}
                                        </div>
                                        <p className="mt-2 text-sm">
                                            {filterToday && "Try turning off the 'Today's Patients' filter."}
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}