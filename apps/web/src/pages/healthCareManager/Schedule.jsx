// src/pages/manager/Schedule.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiFilter, FiSearch, FiUsers, FiClock, FiPlus } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';

// --- Mock Data ---

const mockAppointments = [
  { id: 'a1', doctor: 'Dr. Jane Smith', patient: 'A. Ranaweera', time: '10:00 AM', status: 'Booked', specialty: 'Cardiology' },
  { id: 'a2', doctor: 'Dr. Nimal Fernando', patient: 'S. Perera', time: '11:30 AM', status: 'Completed', specialty: 'Neurology' },
  { id: 'a3', doctor: 'Dr. Jane Smith', patient: 'K. Silva', time: '1:00 PM', status: 'Cancelled', specialty: 'Cardiology' },
  { id: 'a4', doctor: 'Dr. Ravi Bandara', patient: 'H. De Silva', time: '09:00 AM', status: 'Booked', specialty: 'Orthopedics' },
  { id: 'a5', doctor: 'Dr. Jane Smith', patient: 'M. Gomez', time: '02:30 PM', status: 'Booked', specialty: 'Cardiology' },
];

const mockDoctors = [
    { name: 'Dr. Jane Smith', specialty: 'Cardiology' },
    { name: 'Dr. Nimal Fernando', specialty: 'Neurology' },
    { name: 'Dr. Ravi Bandara', specialty: 'Orthopedics' },
];

// --- Reusable Component ---
const AppointmentRowSkeleton = () => (
    <tr className="animate-pulse border-b border-gray-100">
        {[...Array(5)].map((_, i) => (
            <td key={i} className="p-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
        ))}
    </tr>
);


// --- Main Schedule Component ---
export default function Schedule() {
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]); // Today's date YYYY-MM-DD

    // 1. Fetch Data (Simulated)
    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1200)); 
            setAppointments(mockAppointments);
            setIsLoading(false);
        };
        fetchSchedule();
    }, []);

    // 2. Filter and Search Logic
    const filteredAppointments = useMemo(() => {
        let list = appointments;

        // Filter by Doctor
        if (selectedDoctor !== 'All') {
            list = list.filter(app => app.doctor === selectedDoctor);
        }

        // Search by Patient Name
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            list = list.filter(app => app.patient.toLowerCase().includes(searchLower));
        }

        return list;
    }, [appointments, selectedDoctor, searchTerm]);
    
    // Helper to determine status style
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Booked':
                return 'bg-blue-100 text-blue-800';
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-care-dark mb-4 flex items-center gap-3">
                <FiCalendar className="text-care-primary" /> Facility Schedule Management
            </h1>
            <p className="text-gray-500 mb-8">
                Monitor and manage all current appointments across the entire facility.
            </p>

            {/* --- Date and Quick Action Bar --- */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-5 rounded-xl shadow-md mb-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4 lg:mb-0 w-full lg:w-auto">
                    <label htmlFor="view-date" className="text-lg font-medium text-gray-600">Viewing Date:</label>
                    <input
                        type="date"
                        id="view-date"
                        value={viewDate}
                        onChange={(e) => setViewDate(e.target.value)}
                        className="p-2 border rounded-lg focus:ring-care-primary focus:border-care-primary"
                    />
                </div>
                
                <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-care-primary text-white font-semibold rounded-lg shadow-md hover:bg-care-dark transition-colors"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Opening Modal for New Appointment/Resource Booking...')}
                >
                    <FiPlus size={20} /> New Booking
                </motion.button>
            </div>


            {/* --- Filters and Search --- */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Doctor Filter */}
                    <div className="flex items-center gap-3">
                        <FaUserMd size={20} className="text-care-primary" />
                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="p-2 border rounded-lg w-full"
                        >
                            <option value="All">All Doctors ({mockDoctors.length})</option>
                            {mockDoctors.map(doc => (
                                <option key={doc.name} value={doc.name}>
                                    {doc.name} ({doc.specialty})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Patient Search */}
                    <div className="flex items-center gap-3 col-span-1 md:col-span-2">
                        <FiSearch size={20} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by Patient Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded-lg w-full"
                        />
                    </div>
                </div>
            </div>

            {/* --- Appointments Table --- */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-care-light border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Time</th>
                                <th className="p-4 font-semibold text-gray-600">Patient</th>
                                <th className="p-4 font-semibold text-gray-600">Doctor</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600">Specialty</th>
                                <th className="p-4 font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => <AppointmentRowSkeleton key={i} />)
                            ) : filteredAppointments.length > 0 ? (
                                filteredAppointments.map((app) => (
                                    <motion.tr 
                                        key={app.id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="p-4 flex items-center gap-2 font-medium text-gray-800">
                                            <FiClock size={16} className="text-care-primary" /> {app.time}
                                        </td>
                                        <td className="p-4 text-gray-700">{app.patient}</td>
                                        <td className="p-4 text-gray-700">{app.doctor}</td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{app.specialty}</td>
                                        <td className="p-4">
                                            <motion.button 
                                                className="text-care-primary hover:text-care-dark text-sm font-medium"
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => alert(`Editing appointment ID: ${app.id}`)}
                                            >
                                                Manage
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-12 text-gray-500">
                                        <p className="text-xl font-semibold">No appointments found.</p>
                                        <p className="mt-2 text-sm">Adjust your filters or try a different date.</p>
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