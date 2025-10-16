// src/pages/patient/Profile.jsx (Updated PatientDetailsTab)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiGlobe, FiMail, FiPhone, FiCalendar, FiMapPin, FiHeart, FiLock, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { FaTruckMedical } from 'react-icons/fa6'; // Using Fa6 for more icons
import { FaUserMd } from "react-icons/fa";

// --- Mock Data (Replace with API context/calls) ---
const mockUserData = {
  email: 'john.doe@example.com',
  phone: '0771234567',
  firstName: 'John',
  lastName: 'Doe',
};

// UPDATED MOCK PATIENT DATA to match all Schema fields
const mockPatientData = {
  nhsNumber: 'P1234567',
  dob: '1990-05-15', 
  gender: 'male',
  address: {
    line1: '123 Main St',
    line2: 'Apt 4B',
    city: 'Colombo',
    postalCode: '00300',
    country: 'Sri Lanka'
  },
  emergencyContacts: [
      { name: 'Jane Doe', relation: 'Wife', phone: '0719876543' }
  ],
  allergies: ['Peanuts', 'Penicillin'], // Array of strings
  chronicConditions: ['Asthma', 'Diabetes Type 2'], // Array of strings
  primaryDoctor: 'Dr. Nimali Silva (Mock ID)', // Mock for display
  insurance: { 
      provider: 'MediCare Insurance PLC', 
      policyNumber: 'MC889900', 
      validUntil: '2026-12-31' // Stored as string for input type="date"
  },
  metadata: {}
};
// ---------------------------------------------------

// Reusable Input Component (No changes from previous)
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

// --- Tab 1: Account Details Update (Skipped for brevity) ---
// ... (AccountDetailsTab remains the same)
const AccountDetailsTab = ({ userData, setUserData }) => {
    // ... (Implementation from previous response)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Saving Account Details:", userData);
        alert("Account details updated successfully! (Mock Save)");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-semibold text-care-dark mb-6">Personal Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput label="First Name" name="firstName" value={userData.firstName} onChange={handleChange} icon={FiUser} />
                <ProfileInput label="Last Name" name="lastName" value={userData.lastName} onChange={handleChange} icon={FiUser} />
                <ProfileInput label="Email Address" name="email" value={userData.email} onChange={handleChange} type="email" icon={FiMail} />
                <ProfileInput label="Phone Number" name="phone" value={userData.phone} onChange={handleChange} icon={FiPhone} />
            </div>

            <h3 className="text-xl font-semibold text-care-dark mt-8 mb-4">Password Update</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput label="New Password" name="newPassword" type="password" icon={FiLock} />
                <ProfileInput label="Confirm New Password" name="confirmPassword" type="password" icon={FiLock} />
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
// ---------------------------------------------------


// --- Tab 2: Patient Details Update (FULLY UPDATED) ---
const PatientDetailsTab = ({ patientData, setPatientData }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        const [key1, key2] = name.split('.');

        // Handle nested fields (address, insurance)
        if (key2) {
            setPatientData(prev => ({ 
                ...prev, 
                [key1]: { ...prev[key1], [key2]: value } 
            }));
        // Handle array of strings (allergies, chronicConditions)
        } else if (name === 'allergies' || name === 'chronicConditions') {
             // Converts comma-separated string back to array of trimmed strings
            setPatientData(prev => ({ 
                ...prev, 
                [name]: value.split(',').map(s => s.trim()).filter(s => s) 
            }));
        // Handle direct fields (dob, gender)
        } else {
            setPatientData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        // --- TODO: Implement API call to update patient data ---
        console.log("Saving Patient Details:", patientData);
        alert("Patient details updated successfully! (Mock Save)");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-semibold text-care-dark mb-6">Patient Health & Personal Details</h2>
            
            {/* Demographic and ID */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Identification & Demographics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProfileInput 
                    label="NHS/ID Number" 
                    name="nhsNumber" 
                    value={patientData.nhsNumber} 
                    readOnly // Often read-only after creation
                    icon={FaUserMd}
                />
                <ProfileInput 
                    label="Date of Birth" 
                    name="dob" 
                    value={patientData.dob} 
                    onChange={handleChange} 
                    type="date" 
                    icon={FiCalendar}
                />
                <div className="flex flex-col space-y-1">
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <select
                        name="gender"
                        value={patientData.gender}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg focus:ring-care-primary focus:border-care-primary transition duration-150 pl-4 bg-white text-gray-800"
                    >
                        <option value="unknown">Unknown</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Address */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Contact Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                    label="Address Line 1" 
                    name="address.line1" 
                    value={patientData.address.line1} 
                    onChange={handleChange} 
                    icon={FiMapPin}
                />
                <ProfileInput 
                    label="Address Line 2 (Optional)" 
                    name="address.line2" 
                    value={patientData.address.line2} 
                    onChange={handleChange} 
                    icon={FiMapPin}
                />
                <ProfileInput 
                    label="City/Town" 
                    name="address.city" 
                    value={patientData.address.city} 
                    onChange={handleChange} 
                    icon={FiGlobe}
                />
                <ProfileInput 
                    label="Postal Code" 
                    name="address.postalCode" 
                    value={patientData.address.postalCode} 
                    onChange={handleChange} 
                />
                <ProfileInput 
                    label="Country" 
                    name="address.country" 
                    value={patientData.address.country} 
                    onChange={handleChange} 
                />
            </div>
            
            {/* Medical History */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Medical History</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput 
                    label="Allergies (Comma Separated)" 
                    name="allergies" 
                    placeholder="e.g., Peanuts, Penicillin, Latex"
                    value={patientData.allergies.join(', ')} 
                    onChange={handleChange} 
                    icon={FiAlertTriangle}
                />
                <ProfileInput 
                    label="Chronic Conditions (Comma Separated)" 
                    name="chronicConditions" 
                    placeholder="e.g., Asthma, Diabetes, Hypertension"
                    value={patientData.chronicConditions.join(', ')} 
                    onChange={handleChange} 
                    icon={FiHeart}
                />
                <ProfileInput 
                    label="Primary Care Doctor (Read Only)" 
                    name="primaryDoctor" 
                    value={patientData.primaryDoctor} 
                    readOnly 
                    icon={FaUserMd}
                />
            </div>

            {/* Insurance */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Insurance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProfileInput 
                    label="Provider Name" 
                    name="insurance.provider" 
                    value={patientData.insurance.provider} 
                    onChange={handleChange} 
                    icon={FiShield}
                />
                <ProfileInput 
                    label="Policy Number" 
                    name="insurance.policyNumber" 
                    value={patientData.insurance.policyNumber} 
                    onChange={handleChange} 
                />
                <ProfileInput 
                    label="Policy Valid Until" 
                    name="insurance.validUntil" 
                    value={patientData.insurance.validUntil} 
                    onChange={handleChange} 
                    type="date"
                />
            </div>

            {/* Emergency Contacts */}
            <h3 className="text-xl font-semibold text-care-primary mt-8 mb-4">Emergency Contact</h3>
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-sm text-red-800 rounded-md">
                <p className="font-semibold flex items-center gap-2"><FaTruckMedical /> Current Emergency Contact (Read-Only Demo)</p>
                {patientData.emergencyContacts.length > 0 ? (
                    patientData.emergencyContacts.map((contact, index) => (
                        <p key={index} className="ml-5 mt-1">{contact.name} ({contact.relation}) - {contact.phone}</p>
                    ))
                ) : (
                    <p className="ml-5 mt-1">No emergency contacts listed.</p>
                )}
                <p className="mt-2 text-xs">A dedicated component is required for adding/editing multiple contacts (array of objects).</p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <motion.button
                    onClick={handleSave}
                    className="px-6 py-2 bg-care-primary text-white font-semibold rounded-lg shadow-md hover:bg-care-dark transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Save Patient Details
                </motion.button>
            </div>
        </motion.div>
    );
};

// --- Main Profile Component ---
export default function Profile() {
    const [activeTab, setActiveTab] = useState('account');
    const [userData, setUserData] = useState(mockUserData);
    const [patientData, setPatientData] = useState(mockPatientData);

    const tabs = [
        { id: 'account', label: 'Account Details', icon: FiUser, component: AccountDetailsTab },
        { id: 'patient', label: 'Patient Details', icon: FaUserMd, component: PatientDetailsTab },
    ];

    const ActiveComponent = tabs.find(tab => tab.id === activeTab).component;

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-4xl font-bold text-care-dark mb-8">User Profile Settings</h1>

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
                    patientData={patientData} 
                    setPatientData={setPatientData} 
                />
            </div>
        </div>
    );
}