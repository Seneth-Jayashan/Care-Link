// src/pages/doctor/Profile.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiStar, FiFileText, FiDollarSign, FiCalendar, FiPlus, FiTrash2 } from 'react-icons/fi';
import { FaHospital } from 'react-icons/fa6';
import {FaUserMd} from 'react-icons/fa'
// --- Mock Data (Replace with API context/calls) ---
const mockUserData = {
  email: 'dr.jane.smith@hospital.com',
  phone: '0775551212',
  firstName: 'Jane',
  lastName: 'Smith',
};

// UPDATED MOCK DOCTOR DATA to match all Schema fields
const mockDoctorData = {
  hospital: 'Colombo General Hospital (Mock ID)', // Ref to Hospital
  department: 'Cardiology',
  specialty: 'Interventional Cardiology',
  qualifications: ['MBBS (Col)', 'MD (Cardio)'], // Array of strings
  registrationId: 'SLMC/12345',
  availability: [
      { dayOfWeek: 1, from: '09:00', to: '13:00' }, // Monday
      { dayOfWeek: 3, from: '14:00', to: '17:00' }, // Wednesday
  ],
  consultationFee: 4500,
};
// ---------------------------------------------------

// Reusable Input Component
const ProfileInput = ({ label, name, value, onChange, type = 'text', icon: Icon, readOnly = false, placeholder = '' }) => (
    <div className="flex flex-col space-y-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-600">{label}</label>
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            )}
            <input
                id={name}
                name={name}
                type={type}
                value={value || ''}
                onChange={onChange}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`w-full p-2 border rounded-lg focus:ring-care-primary focus:border-care-primary transition duration-150 ${Icon ? 'pl-10' : 'pl-4'} ${readOnly ? 'bg-gray-50 text-gray-500' : 'bg-white text-gray-800'}`}
            />
        </div>
    </div>
);

// --- Tab 1: Account Details Update ---
const AccountDetailsTab = ({ userData, setUserData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // API call to update user data
        console.log("Saving Account Details:", userData);
        alert("Account details updated successfully! (Mock Save)");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-semibold text-care-dark mb-6">Personal Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                    label="First Name" 
                    name="firstName" 
                    value={userData.firstName} 
                    onChange={handleChange} 
                    icon={FiUser} 
                />
                <ProfileInput 
                    label="Last Name" 
                    name="lastName" 
                    value={userData.lastName} 
                    onChange={handleChange} 
                    icon={FiUser} 
                />
                <ProfileInput 
                    label="Email Address" 
                    name="email" 
                    value={userData.email} 
                    onChange={handleChange} 
                    type="email" 
                    icon={FiMail} 
                />
                <ProfileInput 
                    label="Phone Number" 
                    name="phone" 
                    value={userData.phone} 
                    onChange={handleChange} 
                    icon={FiPhone} 
                />
            </div>

            <h3 className="text-xl font-semibold text-care-dark mt-8 mb-4">Password Update</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                    label="New Password" 
                    name="newPassword" 
                    type="password" 
                    icon={FiLock} 
                />
                <ProfileInput 
                    label="Confirm New Password" 
                    name="confirmPassword" 
                    type="password" 
                    icon={FiLock} 
                />
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <motion.button
                    onClick={handleSave}
                    className="px-6 py-2 bg-care-primary text-white font-semibold rounded-lg shadow-md hover:bg-care-dark transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Save Account Details
                </motion.button>
            </div>
        </motion.div>
    );
};

// --- Sub-Component for Availability Management (for Doctor Details Tab) ---
const AvailabilitySlot = ({ day, from, to, index, onUpdate, onRemove }) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col md:flex-row items-center gap-3 p-3 bg-gray-50 border rounded-lg shadow-sm"
        >
            <div className="w-full md:w-1/4 font-semibold text-gray-700">{dayNames[day]}</div>
            
            {/* From Time */}
            <input
                type="time"
                value={from}
                onChange={(e) => onUpdate(index, 'from', e.target.value)}
                className="w-full md:w-1/4 p-2 border rounded-lg"
            />
            {/* To Time */}
            <input
                type="time"
                value={to}
                onChange={(e) => onUpdate(index, 'to', e.target.value)}
                className="w-full md:w-1/4 p-2 border rounded-lg"
            />
            
            <motion.button
                onClick={() => onRemove(index)}
                className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full md:w-auto w-full mt-2 md:mt-0"
                whileTap={{ scale: 0.9 }}
                title="Remove slot"
            >
                <FiTrash2 size={20} />
            </motion.button>
        </motion.div>
    );
};

// --- Tab 2: Professional Details Update ---
const ProfessionalDetailsTab = ({ doctorData, setDoctorData }) => {
    const handleDoctorChange = (e) => {
        const { name, value } = e.target;
        // Handle array of strings (qualifications)
        if (name === 'qualifications') {
             // Converts comma-separated string back to array of trimmed strings
            setDoctorData(prev => ({ 
                ...prev, 
                [name]: value.split(',').map(s => s.trim()).filter(s => s) 
            }));
        } else {
            setDoctorData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUpdateAvailability = (index, field, value) => {
        const newAvailability = [...doctorData.availability];
        newAvailability[index] = { ...newAvailability[index], [field]: value };
        setDoctorData(prev => ({ ...prev, availability: newAvailability }));
    };

    const handleRemoveAvailability = (index) => {
        const newAvailability = doctorData.availability.filter((_, i) => i !== index);
        setDoctorData(prev => ({ ...prev, availability: newAvailability }));
    };

    const handleAddAvailability = () => {
        const defaultSlot = { dayOfWeek: 0, from: '09:00', to: '17:00' };
        setDoctorData(prev => ({ ...prev, availability: [...prev.availability, defaultSlot] }));
    };

    const handleSave = () => {
        // API call to update doctor data
        console.log("Saving Professional Details:", doctorData);
        alert("Professional details updated successfully! (Mock Save)");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-semibold text-care-dark mb-6">Professional & Practice Details</h2>
            
            {/* Practice Details */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Practice Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                    label="SLMC Registration ID" 
                    name="registrationId" 
                    value={doctorData.registrationId} 
                    onChange={handleDoctorChange} 
                    icon={FiFileText}
                />
                <ProfileInput 
                    label="Specialty" 
                    name="specialty" 
                    value={doctorData.specialty} 
                    onChange={handleDoctorChange} 
                    icon={FiStar}
                />
                <ProfileInput 
                    label="Department" 
                    name="department" 
                    value={doctorData.department} 
                    onChange={handleDoctorChange} 
                    icon={FaHospital}
                />
                <ProfileInput 
                    label="Hospital (Read Only in Demo)" 
                    name="hospital" 
                    value={doctorData.hospital} 
                    readOnly
                    icon={FaHospital}
                />
            </div>

            {/* Qualifications & Fees */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Qualifications & Fees</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                    label="Qualifications (Comma Separated)" 
                    name="qualifications" 
                    placeholder="e.g., MBBS (Col), MD (Cardio)"
                    value={doctorData.qualifications.join(', ')} 
                    onChange={handleDoctorChange} 
                    icon={FiFileText}
                />
                <ProfileInput 
                    label="Consultation Fee (LKR)" 
                    name="consultationFee" 
                    value={doctorData.consultationFee} 
                    onChange={handleDoctorChange} 
                    type="number"
                    icon={FiDollarSign}
                />
            </div>
            
            {/* Availability */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4 flex items-center justify-between">
                Weekly Availability Slots
                <motion.button
                    onClick={handleAddAvailability}
                    className="flex items-center gap-1 text-sm px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus /> Add Slot
                </motion.button>
            </h3>

            <div className="space-y-3">
                {doctorData.availability.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No availability slots defined. Click 'Add Slot' to set your weekly hours.</p>
                    </div>
                ) : (
                    doctorData.availability.map((slot, index) => (
                        <AvailabilitySlot
                            key={index}
                            index={index}
                            day={slot.dayOfWeek}
                            from={slot.from}
                            to={slot.to}
                            onUpdate={handleUpdateAvailability}
                            onRemove={handleRemoveAvailability}
                        />
                    ))
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <motion.button
                    onClick={handleSave}
                    className="px-6 py-2 bg-care-primary text-white font-semibold rounded-lg shadow-md hover:bg-care-dark transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Save Professional Details
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Main Profile Component ---
export default function Profile() {
    const [activeTab, setActiveTab] = useState('account');
    const [userData, setUserData] = useState(mockUserData);
    const [doctorData, setDoctorData] = useState(mockDoctorData);

    const tabs = [
        { id: 'account', label: 'Account Details', icon: FiUser, component: AccountDetailsTab },
        { id: 'professional', label: 'Professional Details', icon: FaUserMd, component: ProfessionalDetailsTab },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab).component;
    
    // In a real app, use useEffect to fetch initial data here

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-care-dark mb-8">Doctor Profile Settings</h1>

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
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                <ActiveComponent 
                    userData={userData} 
                    setUserData={setUserData} 
                    doctorData={doctorData} 
                    setDoctorData={setDoctorData} 
                />
            </div>
        </div>
    );
}