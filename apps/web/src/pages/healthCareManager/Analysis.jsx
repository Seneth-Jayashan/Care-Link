// src/pages/manager/Analysis.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiDollarSign, FiClock, FiUsers, FiHeart, FiFileText, FiBarChart2, FiCalendar, FiXCircle, FiArrowDownRight } from 'react-icons/fi';
import { FaHospital } from 'react-icons/fa6';

// --- Mock Data ---

const mockAnalysisData = {
  // Financial KPIs
  revenueLastMonth: 2500000, // LKR
  avgConsultationFee: 4250, // LKR
  costPerPatient: 1500, // LKR
  // Operational KPIs
  totalAppointments: 1850,
  occupancyRate: '85%', // Facility occupancy/usage
  avgWaitTime: '15 min',
  cancellationRate: '12%',
  // Patient KPIs
  totalPatients: 9500,
  readmissionRate: '2.5%',
  patientSatisfaction: '4.7/5',
};

// --- Reusable Components ---

const AnalysisCard = ({ title, value, icon: Icon, colorClass = 'text-care-primary', subText }) => (
    <motion.div 
        className="bg-white p-6 rounded-xl shadow-lg border-b-4 border-care-primary/50"
        whileHover={{ translateY: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.3 }}
    >
        <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-gray-600">{title}</h3>
            <Icon size={24} className={colorClass} />
        </div>
        <p className={`mt-3 text-3xl font-bold text-care-dark`}>
            {value}
        </p>
        {subText && (
            <p className="mt-1 text-sm text-gray-500">{subText}</p>
        )}
    </motion.div>
);

const TrendChartPlaceholder = ({ title }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-semibold text-care-dark mb-4">{title} Trend</h3>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded text-gray-500">
            [Placeholder for Data Visualization Chart (e.g., Line Chart)]
        </div>
    </div>
);


// --- Main Analysis Component ---
export default function Analysis() {
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Simulate fetching analysis data
    useEffect(() => {
        setIsLoading(true);
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setData(mockAnalysisData);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const formatCurrency = (amount) => `LKR ${amount.toLocaleString()}`;

    if (isLoading) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold text-care-dark mb-8">Facility Analysis Dashboard</h1>
                <div className="animate-pulse space-y-6">
                    <div className="grid grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="h-64 bg-gray-100 rounded-xl"></div>
                        <div className="h-64 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-care-dark mb-8 flex items-center gap-3">
                <FiBarChart2 className="text-care-primary" /> Facility Analysis Dashboard
            </h1>
            <p className="text-gray-500 mb-8">
                Key Performance Indicators (KPIs) showing the health and efficiency of the healthcare facility.
            </p>

            {/* --- Section 1: Financial Health --- */}
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2 flex items-center gap-2">
                <FiDollarSign className="text-green-600" /> Financial Health
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalysisCard 
                    title="Revenue (Last 30 Days)" 
                    value={formatCurrency(data.revenueLastMonth)} 
                    icon={FiTrendingUp} 
                    colorClass="text-green-600"
                    subText="+5% from previous month"
                />
                <AnalysisCard 
                    title="Avg. Consultation Fee" 
                    value={formatCurrency(data.avgConsultationFee)} 
                    icon={FiDollarSign} 
                    colorClass="text-green-500"
                />
                <AnalysisCard 
                    title="Cost Per Patient Visit" 
                    value={formatCurrency(data.costPerPatient)} 
                    icon={FiFileText} 
                    colorClass="text-red-500"
                />
                <AnalysisCard 
                    title="Gross Margin %" 
                    value="64%" 
                    icon={FiBarChart2} 
                    colorClass="text-green-700"
                    subText="Target: 60%"
                />
            </div>

            {/* --- Section 2: Operational Efficiency --- */}
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2 flex items-center gap-2">
                <FiClock className="text-blue-600" /> Operational Efficiency
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalysisCard 
                    title="Total Appointments (YTD)" 
                    value={data.totalAppointments.toLocaleString()} 
                    icon={FiCalendar} 
                    colorClass="text-indigo-500"
                />
                <AnalysisCard 
                    title="Facility Occupancy Rate" 
                    value={data.occupancyRate} 
                    icon={FaHospital} 
                    colorClass="text-purple-500"
                />
                <AnalysisCard 
                    title="Avg. Patient Wait Time" 
                    value={data.avgWaitTime} 
                    icon={FiClock} 
                    colorClass="text-orange-500"
                    subText="Goal: < 10 min"
                />
                <AnalysisCard 
                    title="Appointment No-Show/Cancel" 
                    value={data.cancellationRate} 
                    icon={FiXCircle} 
                    colorClass="text-red-500"
                />
            </div>

            {/* --- Section 3: Patient Metrics & Trends --- */}
            <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2 flex items-center gap-2">
                <FiUsers className="text-purple-600" /> Patient Health & Flow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TrendChartPlaceholder title="Monthly Patient Volume" />
                <TrendChartPlaceholder title="Revenue vs. Cost Trend" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
                <AnalysisCard 
                    title="Total Registered Patients" 
                    value={data.totalPatients.toLocaleString()} 
                    icon={FiUsers} 
                    colorClass="text-care-primary"
                />
                <AnalysisCard 
                    title="Readmission Rate" 
                    value={data.readmissionRate} 
                    icon={FiArrowDownRight} 
                    colorClass="text-red-600"
                    subText="Lower is better"
                />
                <AnalysisCard 
                    title="Patient Satisfaction" 
                    value={data.patientSatisfaction} 
                    icon={FiHeart} 
                    colorClass="text-yellow-600"
                    subText="Based on exit surveys"
                />
            </div>

        </motion.div>
    );
}