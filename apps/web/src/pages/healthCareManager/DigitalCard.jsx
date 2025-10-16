// src/pages/manager/DigitalCard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiDownload, FiUser, FiSend, FiLink } from 'react-icons/fi';
import { FaUserMd } from 'react-icons/fa';
import { BsQrCode } from "react-icons/bs";
import { QRCodeCanvas } from 'qrcode.react'; // ✅ Correct import

// --- Mock Data ---
const mockDoctors = [
  { 
    id: 'd1', 
    name: 'Dr. Jane Smith', 
    specialty: 'Cardiology', 
    regId: 'SLMC/12345',
    phone: '0775551212',
    email: 'jane.s@hospital.com',
    facility: 'City Care Hospital',
  },
  { 
    id: 'd2', 
    name: 'Dr. Nimal Fernando', 
    specialty: 'Neurology', 
    regId: 'SLMC/67890',
    phone: '0719998887',
    email: 'nimal.f@hospital.com',
    facility: 'City Care Hospital',
  },
];

// --- Doctor Card Component ---
const DoctorDigitalCard = ({ doctor }) => {
  const cardData = useMemo(
    () =>
      `BEGIN:VCARD\nFN:${doctor.name}\nORG:${doctor.facility}\nTITLE:${doctor.specialty}\nTEL:${doctor.phone}\nEMAIL:${doctor.email}\nEND:VCARD`,
    [doctor]
  );

  return (
    <motion.div
      className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300"
      style={{ width: '350px' }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-3 mb-3">
        <div className="flex items-center gap-3">
          <FaUserMd size={30} className="text-care-primary" />
          <h3 className="text-xl font-bold text-care-dark">{doctor.name}</h3>
        </div>
        <div className="p-1 border border-gray-300 rounded">
          {/* ✅ Proper QR Code */}
          <QRCodeCanvas value={cardData} size={60} level="H" />
        </div>
      </div>

      {/* Body */}
      <p className="text-lg font-semibold text-gray-700">{doctor.specialty}</p>
      <p className="text-sm text-gray-500 mb-4">{doctor.facility}</p>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <FiMail size={16} className="text-care-primary" />
          <span>{doctor.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FiPhone size={16} className="text-care-primary" />
          <span>{doctor.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FiUser size={16} className="text-care-primary" />
          <span>Reg ID: {doctor.regId}</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main DigitalCard Page ---
export default function DigitalCard() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate Data Fetch
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDoctors(mockDoctors);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // --- Action Handlers ---
  const handleSendCard = (doctor) => {
    alert(`📩 Simulating sending digital card for ${doctor.name} to their email: ${doctor.email}`);
  };

  const handleDownloadCard = (doctor) => {
    alert(`💾 Simulating downloading card image for ${doctor.name}.`);
  };

  const handleCopyLink = (doctor) => {
    const link = `${window.location.origin}/card/${doctor.id}`;
    navigator.clipboard.writeText(link);
    alert(`🔗 Card link copied: ${link}`);
  };

  // --- Render ---
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h1 className="text-4xl font-bold text-care-dark mb-4 flex items-center gap-3">
        <BsQrCode className="text-care-primary" /> Digital Card Management
      </h1>
      <p className="text-gray-500 mb-8">
        View and manage digital business cards and contact information for the facility's doctors.
      </p>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-72 bg-gray-200 rounded-2xl"></div>
          <div className="h-72 bg-gray-200 rounded-2xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {doctors.map(doctor => (
            <div
              key={doctor.id}
              className="flex flex-col md:flex-row gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-200"
            >
              {/* Digital Card */}
              <DoctorDigitalCard doctor={doctor} />

              {/* Actions Panel */}
              <div className="flex-grow space-y-3 p-4">
                <h3 className="text-lg font-bold text-care-dark mb-3">Card Actions</h3>

                <motion.button
                  onClick={() => handleSendCard(doctor)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <FiSend size={18} /> Send to Doctor
                </motion.button>

                <motion.button
                  onClick={() => handleDownloadCard(doctor)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-care-primary text-white font-semibold rounded-lg hover:bg-care-dark transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <FiDownload size={18} /> Download Card Image
                </motion.button>

                <motion.button
                  onClick={() => handleCopyLink(doctor)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <FiLink size={18} /> Copy Share Link
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
