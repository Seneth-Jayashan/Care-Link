// src/pages/doctor/Reports.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiBarChart2, FiUsers, FiCalendar, FiArrowDownRight, FiCheckCircle, FiXCircle, FiClock, FiPlus } from 'react-icons/fi';
import { FaBookMedical } from 'react-icons/fa6';

// --- Mock Data & Helpers ---

const mockReportData = {
    // Booking Report Metrics
    bookings: {
        totalAppointments: 185,
        completed: 150,
        cancelled: 25,
        noShow: 10,
        currentMonth: 42,
        cancellationRate: '13.5%', // (25 / 185) * 100
        avgConsultTime: '18 min',
    },
    // Patient Report Metrics
    patients: {
        totalPatients: 112,
        newPatientsLastMonth: 15,
        mostCommonCondition: 'Hypertension',
        ageDistribution: { '0-18': '10%', '19-45': '45%', '46+': '45%' },
        genderDistribution: { male: '55%', female: '40%', other: '5%' },
    }
};

const ReportCard = ({ title, value, icon: Icon, colorClass = 'text-care-primary' }) => (
    <motion.div 
        className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
        whileHover={{ translateY: -5 }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
            <Icon size={24} className={colorClass} />
        </div>
        <p className={`mt-3 text-4xl font-bold ${colorClass}`}>
            {value}
        </p>
    </motion.div>
);

// --- Report Tab Components ---

const BookingReports = ({ data }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <h2 className="text-2xl font-bold text-care-dark mb-6 border-b pb-3">Appointment Metrics Overview</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard 
                title="Total Appointments" 
                value={data.totalAppointments} 
                icon={FiBarChart2} 
            />
            <ReportCard 
                title="Completed" 
                value={data.completed} 
                icon={FiCheckCircle} 
                colorClass="text-green-500" 
            />
            <ReportCard 
                title="Cancellation Rate" 
                value={data.cancellationRate} 
                icon={FiArrowDownRight} 
                colorClass="text-red-500" 
            />
            <ReportCard 
                title="Avg. Consultation Time" 
                value={data.avgConsultTime} 
                icon={FiClock} 
                colorClass="text-indigo-500" 
            />
        </div>

        <h3 className="text-xl font-semibold text-care-dark mt-8 mb-4">Breakdown & Trends</h3>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <p className="font-medium mb-3">Appointment Status Distribution (All Time):</p>
            <div className="flex justify-around text-center">
                <div className="text-blue-600">
                    <p className="text-3xl font-bold">{data.totalAppointments - data.completed - data.cancelled - data.noShow}</p>
                    <p className="text-sm">Booked</p>
                </div>
                <div className="text-green-600">
                    <p className="text-3xl font-bold">{data.completed}</p>
                    <p className="text-sm">Completed</p>
                </div>
                <div className="text-red-600">
                    <p className="text-3xl font-bold">{data.cancelled}</p>
                    <p className="text-sm">Cancelled</p>
                </div>
                <div className="text-yellow-600">
                    <p className="text-3xl font-bold">{data.noShow}</p>
                    <p className="text-sm">No-Show</p>
                </div>
            </div>
            {/* In a real app, this would be a Chart component (e.g., Recharts) */}
            <div className="h-48 mt-4 bg-gray-200 flex items-center justify-center rounded text-gray-500">
                [Placeholder for Booking Trend Chart (e.g., Bookings per Week)]
            </div>
        </div>
    </motion.div>
);

const PatientReports = ({ data }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <h2 className="text-2xl font-bold text-care-dark mb-6 border-b pb-3">Patient Demographics & Health Summary</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard 
                title="Total Unique Patients" 
                value={data.totalPatients} 
                icon={FiUsers} 
                colorClass="text-care-primary" 
            />
            <ReportCard 
                title="New Patients (Last 30 Days)" 
                value={data.newPatientsLastMonth} 
                icon={FiPlus} 
                colorClass="text-green-500" 
            />
            <ReportCard 
                title="Most Common Condition" 
                value={data.mostCommonCondition} 
                icon={FaBookMedical} 
                colorClass="text-orange-500" 
            />
        </div>

        <h3 className="text-xl font-semibold text-care-dark mt-8 mb-4">Distribution Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p className="font-bold text-lg mb-3 text-gray-700">Age Distribution</p>
                {Object.entries(data.ageDistribution).map(([range, percentage]) => (
                    <div key={range} className="flex justify-between items-center py-1">
                        <span className="text-gray-600">{range}</span>
                        <span className="font-semibold text-care-dark">{percentage}</span>
                    </div>
                ))}
                <div className="h-24 mt-4 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
                    [Placeholder for Age Pie Chart]
                </div>
            </div>

            {/* Gender Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <p className="font-bold text-lg mb-3 text-gray-700">Gender Distribution</p>
                {Object.entries(data.genderDistribution).map(([gender, percentage]) => (
                    <div key={gender} className="flex justify-between items-center py-1 capitalize">
                        <span className="text-gray-600">{gender}</span>
                        <span className="font-semibold text-care-dark">{percentage}</span>
                    </div>
                ))}
                <div className="h-24 mt-4 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
                    [Placeholder for Gender Pie Chart]
                </div>
            </div>
        </div>
    </motion.div>
);


// --- Main Reports Component ---
export default function Reports() {
    const [activeTab, setActiveTab] = useState('bookings');
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState({});

    // Simulate fetching report data
    useEffect(() => {
        setIsLoading(true);
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setReportData(mockReportData);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const tabs = [
        { id: 'bookings', label: 'Booking Reports', icon: FiCalendar, component: BookingReports },
        { id: 'patients', label: 'Patient Reports', icon: FiUsers, component: PatientReports },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab).component;

    if (isLoading) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold text-care-dark mb-8">Analytics & Reports</h1>
                <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-4 gap-4">
                        <div className="h-28 bg-gray-200 rounded-xl"></div>
                        <div className="h-28 bg-gray-200 rounded-xl"></div>
                        <div className="h-28 bg-gray-200 rounded-xl"></div>
                        <div className="h-28 bg-gray-200 rounded-xl"></div>
                    </div>
                    <div className="h-96 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-care-dark mb-8 flex items-center gap-3">
                <FiBarChart2 className="text-care-primary" /> Analytics & Reports
            </h1>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <motion.button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-3 px-6 text-lg font-medium transition-colors border-b-2 
                                ${isActive 
                                    ? 'border-care-primary text-care-primary' 
                                    : 'border-transparent text-gray-500 hover:text-care-dark hover:border-gray-300'
                                }`}
                            whileTap={{ scale: 0.98 }}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Report Content */}
            <div className="min-h-[600px] p-2">
                <ActiveComponent data={reportData[activeTab]} />
            </div>
        </div>
    );
}