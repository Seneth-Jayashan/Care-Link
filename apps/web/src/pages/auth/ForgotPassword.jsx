import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // --- API CALL SIMULATION ---
    // In a real app, you would make an API call here to your backend
    // to trigger the password reset email.
    console.log("Sending password reset link to:", email);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Example error handling:
    // if (!result.success) {
    //   setError("No account found with that email address.");
    //   setIsLoading(false);
    //   return;
    // }

    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-care-light via-care-accent to-blue-200 p-4">
      <motion.div
        className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
              >
                <FiCheckCircle className="text-5xl text-green-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-care-dark mt-6">Check Your Email</h1>
              <p className="text-gray-600 mt-2">
                We've sent a password reset link to <span className="font-semibold text-care-primary">{email}</span>. Please follow the instructions in the email to reset your password.
              </p>
              <div className="mt-8">
                <Link to="/login">
                  <motion.button 
                    className="w-full flex justify-center items-center gap-2 py-3 text-lg font-bold text-white bg-gradient-to-r from-care-primary to-care-dark rounded-xl"
                    whileHover={{ scale: 1.02 }}
                  >
                    <FiArrowLeft /> Back to Sign In
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div variants={itemVariants} className="text-center">
                <h1 className="text-4xl font-bold text-care-dark tracking-tight">Forgot Password?</h1>
                <p className="mt-2 text-gray-600">No worries, we'll send you reset instructions.</p>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-6 pt-8">
                <motion.div variants={itemVariants} className="relative">
                  <FiMail className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"
                  />
                </motion.div>
                
                {error && <p className="text-sm font-medium text-center text-red-600">{error}</p>}

                <motion.div variants={itemVariants} className="pt-2">
                  <motion.button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-3.5 text-lg font-bold text-white bg-gradient-to-r from-care-primary to-care-dark rounded-xl shadow-lg hover:shadow-xl hover:shadow-care-primary/40 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1" whileTap={{ scale: 0.98 }}>
                    {isLoading ? (
                      <>
                        <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ loop: Infinity, duration: 1, ease: "linear" }}/>
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>

              <motion.p variants={itemVariants} className="text-center text-gray-600 mt-8">
                <Link to="/login" className="font-semibold text-care-primary hover:text-care-dark transition-colors flex items-center justify-center gap-2">
                  <FiArrowLeft /> Back to Sign In
                </Link>
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;