// src/pages/patient/Doctors.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch, FiChevronDown } from 'react-icons/fi';

// --- Mock Data (replace with API calls) ---
const mockDoctors = [
  { _id: 'doc1', user: { firstName: 'Nimali', lastName: 'Silva' }, specialty: 'Cardiologist', hospital: 'Asiri Central Hospital', avatar: '👩‍⚕️' },
  { _id: 'doc2', user: { firstName: 'Saman', lastName: 'Perera' }, specialty: 'Dermatologist', hospital: 'Nawaloka Hospital', avatar: '👨🏻‍⚕️' },
  { _id: 'doc3', user: { firstName: 'Priya', lastName: 'Fernando' }, specialty: 'Pediatrician', hospital: 'Lanka Hospitals', avatar: '👩‍⚕️' },
  { _id: 'doc4', user: { firstName: 'Ravi', lastName: 'Jayawardena' }, specialty: 'Cardiologist', hospital: 'Durdans Hospital', avatar: '👨🏻‍⚕️' },
  { _id: 'doc5', user: { firstName: 'Anusha', lastName: 'Bandara' }, specialty: 'Neurologist', hospital: 'Asiri Surgical Hospital', avatar: '👩‍⚕️' },
  { _id: 'doc6', user: { firstName: 'Kamal', lastName: 'De Zoysa' }, specialty: 'Pediatrician', hospital: 'Hemas Hospital', avatar: '👨🏻‍⚕️' },
];

// --- Reusable Components ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
};

const DoctorCard = ({ doctor }) => (
  <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 flex flex-col">
    <div className="flex-grow">
        <div className="flex items-center">
            <div className="text-5xl mr-4 bg-care-accent p-3 rounded-full">{doctor.avatar}</div>
            <div>
                <h3 className="text-xl font-bold text-care-dark">Dr. {doctor.user.firstName} {doctor.user.lastName}</h3>
                <p className="text-care-primary font-semibold">{doctor.specialty}</p>
            </div>
        </div>
        <p className="text-gray-500 mt-4">{doctor.hospital}</p>
    </div>
    {/* --- UPDATED: Two-button layout --- */}
    <div className="mt-6 flex items-center gap-4">
        <Link to={`/doctors/${doctor._id}`} className="w-full">
            <motion.button 
                className="w-full bg-transparent border-2 border-care-primary text-care-primary font-bold py-3 rounded-lg hover:bg-care-accent transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                View Profile
            </motion.button>
        </Link>
        <Link to={`/patient/booking/${doctor._id}`} className="w-full">
            <motion.button 
                className="w-full bg-care-primary text-white font-bold py-3 rounded-lg shadow-md hover:bg-care-dark transition-colors"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
            >
                Book Now
            </motion.button>
        </Link>
    </div>
  </motion.div>
);

const DoctorCardSkeleton = () => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200/80 animate-pulse">
        <div className="flex items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mr-4"></div>
            <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mt-4"></div>
        {/* --- UPDATED: Skeleton for two buttons --- */}
        <div className="mt-6 flex items-center gap-4">
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
        </div>
    </div>
);


// --- Main Doctors Page Component ---

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  // Data fetching and filtering logic remains the same
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors); 
      setIsLoading(false);
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    let result = doctors;
    if (specialtyFilter !== 'All') {
      result = result.filter(doc => doc.specialty === specialtyFilter);
    }
    if (searchTerm) {
      result = result.filter(doc => 
        `${doc.user.firstName} ${doc.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredDoctors(result);
  }, [searchTerm, specialtyFilter, doctors]);

  const uniqueSpecialties = ['All', ...new Set(doctors.map(doc => doc.specialty))];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Filter Bar remains the same */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white rounded-xl shadow-md">
        <div className="relative md:col-span-3">
          <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none"
          />
        </div>
        <div className="relative md:col-span-2">
            <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-care-primary focus:outline-none"
            >
                {uniqueSpecialties.map(spec => (
                    <option key={spec} value={spec}>{spec === 'All' ? 'All Specialties' : spec}</option>
                ))}
            </select>
            <FiChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Doctor Grid remains the same */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => <DoctorCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => <DoctorCard key={doctor._id} doctor={doctor} />)
          ) : (
            <div className="md:col-span-2 xl:col-span-3 text-center py-16">
                <p className="text-2xl font-semibold text-gray-500">No doctors found matching your criteria.</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Doctors;