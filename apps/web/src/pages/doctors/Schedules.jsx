// src/pages/doctor/Schedules.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiSave } from 'react-icons/fi';

// --- Mock Data & Helpers ---

const mockSchedule = {
    // Dates are formatted as 'YYYY-MM-DD'
    '2025-10-16': ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30'],
    '2025-10-17': ['10:00', '10:30', '11:00', '11:30', '12:00'],
    '2025-10-18': ['08:00', '08:30', '09:00', '09:30'],
};

// Function to format Date object to 'YYYY-MM-DD' string
const formatDate = (date) => date.toISOString().split('T')[0];

// --- Sub-Components ---

const TimeSlot = ({ time, onRemove }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.8 }}
        className="flex items-center justify-between bg-care-light text-care-dark p-3 rounded-lg shadow-sm border border-care-primary/30"
    >
        <div className="flex items-center gap-2 font-semibold">
            <FiClock size={16} />
            <span>{time}</span>
        </div>
        <motion.button
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-white"
            whileTap={{ scale: 0.9 }}
            title="Remove time slot"
        >
            <FiTrash2 size={18} />
        </motion.button>
    </motion.div>
);

// --- Main Schedules Component ---
export default function Schedules() {
    // Initialize schedule state with mock data
    const [schedule, setSchedule] = useState(mockSchedule);
    // Set selected date to today by default
    const [selectedDate, setSelectedDate] = useState(formatDate(new Date())); 
    const [newSlotTime, setNewSlotTime] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Get the available slots for the currently selected date
    const slotsForSelectedDate = schedule[selectedDate] || [];

    // --- Handlers ---

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleAddTimeSlot = () => {
        if (!newSlotTime) return;

        // Check for time format and prevent duplicates
        const formattedTime = newSlotTime.trim();

        if (slotsForSelectedDate.includes(formattedTime)) {
            alert(`Time slot ${formattedTime} already exists!`);
            return;
        }

        setSchedule(prevSchedule => {
            const currentSlots = prevSchedule[selectedDate] || [];
            // Add new slot and sort the array
            const newSlots = [...currentSlots, formattedTime].sort();
            
            return {
                ...prevSchedule,
                [selectedDate]: newSlots,
            };
        });
        setNewSlotTime(''); // Clear input after adding
    };

    const handleRemoveTimeSlot = (timeToRemove) => {
        setSchedule(prevSchedule => {
            const newSlots = prevSchedule[selectedDate].filter(time => time !== timeToRemove);
            return {
                ...prevSchedule,
                [selectedDate]: newSlots,
            };
        });
    };

    const handleSaveSchedule = async () => {
        setIsSaving(true);
        // --- TODO: Implement API call to update the doctor's schedule ---
        
        console.log(`Saving schedule for ${selectedDate}:`, schedule[selectedDate]);
        
        // Simulate API latency
        await new Promise(resolve => setTimeout(resolve, 1200)); 

        alert(`Schedule for ${selectedDate} saved successfully!`);
        setIsSaving(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-care-dark mb-4 flex items-center gap-3">
                <FiCalendar className="text-care-primary" /> Manage My Schedule
            </h1>
            <p className="text-gray-500 mb-8">
                Set and update your available consultation time slots for each day.
            </p>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* --- Left Column: Date Picker and Info --- */}
                <div className="lg:w-1/3 p-6 bg-white rounded-2xl shadow-xl border border-gray-100 h-fit">
                    <h2 className="text-2xl font-semibold text-care-dark mb-4">Select Date</h2>
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="schedule-date" className="text-sm font-medium text-gray-600">
                            Viewing Schedule for:
                        </label>
                        <input
                            type="date"
                            id="schedule-date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-full p-3 border rounded-lg focus:ring-care-primary focus:border-care-primary transition duration-150 bg-white text-gray-800 text-lg font-medium"
                        />
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-800 rounded-md">
                        <p className="font-semibold">Note:</p>
                        <p>Time slots shown are those currently available for patient booking.</p>
                        <p>Changes are saved only after clicking "Save Schedule".</p>
                    </div>
                </div>

                {/* --- Right Column: Time Slot Management --- */}
                <div className="lg:w-2/3 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
                    <h2 className="text-2xl font-semibold text-care-dark mb-4">
                        Available Slots
                        <span className="ml-2 text-care-primary text-xl">({slotsForSelectedDate.length})</span>
                    </h2>
                    
                    {/* Add New Slot Input */}
                    <div className="flex gap-3 mb-6">
                        <input
                            type="time"
                            value={newSlotTime}
                            onChange={(e) => setNewSlotTime(e.target.value)}
                            className="p-3 border rounded-lg flex-grow focus:ring-care-primary focus:border-care-primary"
                            placeholder="HH:MM (e.g., 14:30)"
                        />
                        <motion.button
                            onClick={handleAddTimeSlot}
                            disabled={!newSlotTime}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors 
                                ${newSlotTime 
                                    ? 'bg-green-500 text-white hover:bg-green-600' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                            whileTap={{ scale: newSlotTime ? 0.95 : 1 }}
                        >
                            <FiPlus size={20} /> Add Slot
                        </motion.button>
                    </div>

                    {/* Slots List */}
                    <motion.div 
                        layout 
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2"
                    >
                        {slotsForSelectedDate.length > 0 ? (
                            slotsForSelectedDate.map(time => (
                                <TimeSlot
                                    key={time}
                                    time={time}
                                    onRemove={() => handleRemoveTimeSlot(time)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8 text-gray-500">
                                <p className="text-lg font-medium">No slots defined for this day.</p>
                                <p className="text-sm">Use the input above to add your availability.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Save Button */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <motion.button
                            onClick={handleSaveSchedule}
                            disabled={isSaving}
                            className={`flex items-center justify-center gap-3 w-full px-6 py-3 font-bold rounded-lg shadow-lg transition-colors 
                                ${isSaving 
                                    ? 'bg-care-dark/70 text-gray-300 cursor-wait' 
                                    : 'bg-care-primary text-white hover:bg-care-dark'
                                }`}
                            whileHover={{ scale: isSaving ? 1 : 1.01 }}
                            whileTap={{ scale: isSaving ? 1 : 0.99 }}
                        >
                            {isSaving ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave size={20} />
                                    Save Schedule Changes
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}