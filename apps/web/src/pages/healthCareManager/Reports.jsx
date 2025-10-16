// src/pages/manager/Reports.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    FiBarChart2, FiUsers, FiCalendar, FiDollarSign, 
    FiTrendingUp, FiClock, FiFileText, FiRefreshCw 
} from 'react-icons/fi';
import { FaHospital } from 'react-icons/fa6';
import {FaUserMd} from 'react-icons/fa';

// --- Mock Data ---

const mockReports = {
    // 1. Financial Reports
    financial: {
        totalRevenue: 32000000, // Year to Date LKR
        consultationRevenue: 15000000,
        averageFee: 4500,
        insuranceClaimSuccessRate: '92%',
    },
    // 2. Operational Reports
    operational: {
        totalAppointments: 1850,
        appointmentsLastMonth: 210,
        cancellationRate: '12%',
        avgDoctorUtilisation: '78%', // % of bookable slots filled
        peakHour: '10:00 AM - 12:00 PM',
    },
    // 3. Resource Reports
    resource: {
        totalDoctors: 15,
        totalPatients: 9500,
        mostBookedSpecialty: 'General Practice (GP)',
        lowAvailabilitySpecialty: 'Dermatology',
    }
};

// --- Reusable Components ---

const ReportCard = ({ title, value, icon: Icon, colorClass = 'text-care-primary', subText }) => (
    <motion.div 
        className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
        whileHover={{ translateY: -3, boxShadow: '0 5px 10px rgba(0, 0, 0, 0.05)' }}
        transition={{ duration: 0.2 }}
    >
        <div className="flex items-start justify-between">
            <h3 className="text-md font-semibold text-gray-600">{title}</h3>
            <Icon size={24} className={colorClass} />
        </div>
        <p className={`mt-3 text-3xl font-bold text-care-dark`}>
            {value}
        </p>
        {subText && (
            <p className="mt-1 text-xs text-gray-500">{subText}</p>
        )}
    </motion.div>
);

// --- Tab 1: Financial Reports ---
const FinancialReports = ({ data }) => {
    const formatCurrency = (amount) => `LKR ${amount.toLocaleString()}`;
    
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <ReportCard 
                    title="YTD Total Revenue" 
                    value={formatCurrency(data.totalRevenue)} 
                    icon={FiTrendingUp} 
                    colorClass="text-green-600"
                    subText="Excluding Pharmacy Sales"
                />
                <ReportCard 
                    title="Monthly Consultation Revenue" 
                    value={formatCurrency(data.consultationRevenue / 12)} 
                    icon={FiDollarSign} 
                    colorClass="text-green-500"
                    subText={`Average Fee: ${formatCurrency(data.averageFee)}`}
                />
                <ReportCard 
                    title="Insurance Claim Success" 
                    value={data.insuranceClaimSuccessRate} 
                    icon={FiFileText} 
                    colorClass="text-indigo-500"
                    subText="Successful submissions/Total submissions"
                />
                <ReportCard 
                    title="Net Profit Margin (Mock)" 
                    value="25%" 
                    icon={FiBarChart2} 
                    colorClass="text-green-700"
                    subText="Target: 22%"
                />
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-96 flex items-center justify-center">
                 [Placeholder: Revenue Trend Chart (Last 12 Months)]
            </div>
        </motion.div>
    );
};

// --- Tab 2: Operational Reports ---
const OperationalReports = ({ data }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard 
                title="Total Appointments (YTD)" 
                value={data.totalAppointments.toLocaleString()} 
                icon={FiCalendar} 
                colorClass="text-care-primary"
            />
            <ReportCard 
                title="Appointments Last Month" 
                value={data.appointmentsLastMonth.toLocaleString()} 
                icon={FiUsers} 
                colorClass="text-blue-500"
            />
            <ReportCard 
                title="Cancellation/No-Show Rate" 
                value={data.cancellationRate} 
                icon={FiRefreshCw} 
                colorClass="text-red-500"
                subText="Target: < 10%"
            />
            <ReportCard 
                title="Avg. Doctor Utilization" 
                value={data.avgDoctorUtilisation} 
                icon={FiClock} 
                colorClass="text-purple-500"
            />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-64 flex items-center justify-center">
                 [Placeholder: Appointment Volume Breakdown by Day]
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-64">
                <h3 className="font-semibold text-lg mb-2">Peak Booking Time</h3>
                <p className="text-4xl font-bold text-orange-600">{data.peakHour}</p>
                <p className="text-gray-500 mt-2">Focus marketing efforts outside of this window.</p>
            </div>
        </div>
    </motion.div>
);

// --- Tab 3: Resource Reports ---
const ResourceReports = ({ data }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <ReportCard 
                title="Total Active Doctors" 
                value={data.totalDoctors} 
                icon={FaUserMd} 
                colorClass="text-care-primary"
            />
            <ReportCard 
                title="Total Registered Patients" 
                value={data.totalPatients.toLocaleString()} 
                icon={FiUsers} 
                colorClass="text-blue-500"
            />
            <ReportCard 
                title="Most Booked Specialty" 
                value={data.mostBookedSpecialty} 
                icon={FaHospital} 
                colorClass="text-green-500"
            />
        </div>

        <div className="p-6 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <h3 className="font-bold text-lg text-red-800">Capacity Alert</h3>
            <p className="text-red-700">The **{data.lowAvailabilitySpecialty}** department has very low bookable availability. Consider hiring or reallocating doctor time to this specialty to reduce patient wait times.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 h-96 flex items-center justify-center">
             [Placeholder: Specialty Popularity vs. Availability Scatter Plot]
        </div>
    </motion.div>
);


// --- Main Reports Component ---
export default function Reports() {
    const [activeTab, setActiveTab] = useState('financial');
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState({});

    // Simulate fetching report data
    useEffect(() => {
        setIsLoading(true);
        const loadData = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setReportData(mockReports);
            setIsLoading(false);
        };
        loadData();
    }, []);

    const tabs = [
        { id: 'financial', label: 'Financial', icon: FiDollarSign, component: FinancialReports },
        { id: 'operational', label: 'Operational', icon: FiClock, component: OperationalReports },
        { id: 'resource', label: 'Resource', icon: FaHospital, component: ResourceReports },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

    if (isLoading) {
        return (
            <div className="p-8">
                <h1 className="text-4xl font-bold text-care-dark mb-8">Facility Reports</h1>
                <div className="animate-pulse space-y-6">
                    <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="h-96 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-care-dark mb-8 flex items-center gap-3">
                <FiBarChart2 className="text-care-primary" /> Facility Reports
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
            
            {/* Tab Content */}
            <div className="min-h-[600px] p-2">
                {ActiveComponent && <ActiveComponent data={reportData[activeTab]} />}
            </div>
        </div>
    );
}