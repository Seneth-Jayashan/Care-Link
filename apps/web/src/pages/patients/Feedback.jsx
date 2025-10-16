// src/pages/patient/Feedback.jsx

import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext'; // Adjust path as needed
import { FiStar, FiSend, FiCheckCircle } from 'react-icons/fi';

// --- Mock Data (replace with API calls) ---
const mockPastAppointments = [
  { _id: 'appt1', doctor: { user: { firstName: 'Nimali', lastName: 'Silva' } }, scheduledAt: '2025-09-15T09:00:00.000Z' },
  { _id: 'appt2', doctor: { user: { firstName: 'Saman', lastName: 'Perera' } }, scheduledAt: '2025-08-22T11:00:00.000Z' },
];

// --- Reusable Star Rating Component ---
const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setRating(star)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          className="focus:outline-none"
        >
          <FiStar
            size={32}
            className={`transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`}
            style={{ fill: (hoverRating || rating) >= star ? 'currentColor' : 'none' }}
          />
        </motion.button>
      ))}
    </div>
  );
};

// --- Main Feedback Page Component ---
const Feedback = () => {
  const { user } = useContext(AuthContext);

  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState('General');
  const [appointmentId, setAppointmentId] = useState('');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [pastAppointments, setPastAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch the user's past appointments
    // const fetchPastAppointments = async () => {
    //   const res = await api.get('/appointments/past');
    //   setPastAppointments(res.data);
    // };
    // fetchPastAppointments();
    setPastAppointments(mockPastAppointments);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const feedbackData = { rating, feedbackType, appointmentId, comment, isAnonymous, userId: user._id };
    console.log("Submitting feedback:", feedbackData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          // --- Success State ---
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <FiCheckCircle className="mx-auto text-7xl text-green-500 mb-6" />
            <h1 className="text-3xl font-bold text-care-dark">Thank You!</h1>
            <p className="text-lg text-gray-600 mt-2">Your feedback has been submitted successfully.</p>
          </motion.div>
        ) : (
          // --- Form State ---
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-4xl font-bold text-care-dark mb-2">Submit Your Feedback</h1>
            <p className="text-lg text-gray-500 mb-8">We value your opinion and use it to improve our services.</p>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-200/80">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="font-semibold text-gray-700 mb-2 block">1. How would you rate your overall experience?</label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                <div>
                  <label htmlFor="feedbackType" className="font-semibold text-gray-700 mb-2 block">2. What is your feedback about?</label>
                  <select
                    id="feedbackType"
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none"
                  >
                    <option value="General">General App Experience</option>
                    <option value="Appointment Experience">A Specific Appointment</option>
                    <option value="Technical Issue">A Technical Issue</option>
                  </select>
                </div>
                
                <AnimatePresence>
                {feedbackType === 'Appointment Experience' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="appointment" className="font-semibold text-gray-700 mb-2 block">Please select the appointment:</label>
                    <select
                      id="appointment"
                      value={appointmentId}
                      onChange={(e) => setAppointmentId(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none"
                    >
                      <option value="">Choose an appointment...</option>
                      {pastAppointments.map(appt => (
                        <option key={appt._id} value={appt._id}>
                          Dr. {appt.doctor.user.firstName} on {new Date(appt.scheduledAt).toLocaleDateString('en-LK')}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}
                </AnimatePresence>

                <div>
                  <label htmlFor="comment" className="font-semibold text-gray-700 mb-2 block">3. Please share your detailed feedback:</label>
                  <textarea
                    id="comment"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you think..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-care-primary focus:outline-none"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                    <input type="checkbox" id="anonymous" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="h-5 w-5 rounded text-care-primary focus:ring-care-primary"/>
                    <label htmlFor="anonymous" className="ml-3 text-gray-600">Submit anonymously</label>
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.button 
                    type="submit" 
                    disabled={isLoading || rating === 0} 
                    className="flex items-center gap-2 bg-care-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-care-dark transition-colors disabled:bg-gray-400" 
                    whileTap={{ scale: 0.95 }}
                  >
                    {isLoading ? (
                      <>
                        <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ loop: Infinity, duration: 1, ease: "linear" }}/>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FiSend />
                        <span>Submit Feedback</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Feedback;