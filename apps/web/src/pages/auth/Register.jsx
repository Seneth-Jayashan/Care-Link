import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiLogIn } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 

// Animation variants remain the same
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

const Register = () => {
  // --- CONTEXT & NAVIGATION HOOKS ---
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- REDIRECTION LOGIC ---
  // If user is already logged in, redirect them from this page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/login'); // Or any other protected route
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role: role });
  };

  // --- UPDATED SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsLoading(true);

    // Prepare data for the API call (excluding confirmPassword)
    const registrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    };

    // Call the register function from the context
    const result = await register(registrationData);
    
    setIsLoading(false);

    // If the context's register function returns an error, display it
    if (!result.success) {
      setError(result.error || 'Registration failed. Please try again.');
    }
    // On success, the useEffect hook will handle the redirection automatically
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-care-light via-care-accent to-blue-200 p-4 pt-16">
      <motion.div
        className="w-full max-w-xl p-8 sm:p-10 space-y-6 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-care-dark tracking-tight">Get Started with Care Link</h1>
          <p className="mt-2 text-gray-600">Create an account to manage your health journey.</p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative flex w-full max-w-sm mx-auto p-1 bg-care-light rounded-full shadow-inner">
          <button type="button" onClick={() => handleRoleChange('patient')} className="relative w-1/2 py-2 text-center font-semibold text-care-dark transition-colors">
            {formData.role === 'patient' && (
                <motion.div 
                    layoutId="role-highlighter" 
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
            <span className="relative z-10">I'm a Patient</span>
          </button>
          <button type="button" onClick={() => handleRoleChange('doctor')} className="relative w-1/2 py-2 text-center font-semibold text-care-dark transition-colors">
            {formData.role === 'doctor' && (
                <motion.div 
                    layoutId="role-highlighter" 
                    className="absolute inset-0 bg-white rounded-full shadow-md"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
            <span className="relative z-10">I'm a Doctor</span>
          </button>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-5">
          {/* Input fields remain the same */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <FiUser className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"/>
            </div>
            <div className="relative">
              <FiUser className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"/>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"/>
          </motion.div>
          <motion.div variants={itemVariants} className="relative">
            <FiPhone className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
            <input type="tel" name="phone" placeholder="Phone Number (Optional)" value={formData.phone} onChange={handleChange} className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"/>
          </motion.div>
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="relative">
              <FiLock className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"/>
            </div>
            <div className="relative">
              <FiLock className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"/>
            </div>
          </motion.div>
          
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-center text-red-600">{error}</motion.p>
          )}

          <motion.div variants={itemVariants} className="pt-4">
            <motion.button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-3.5 text-lg font-bold text-white bg-gradient-to-r from-care-primary to-care-dark rounded-xl shadow-lg hover:shadow-xl hover:shadow-care-primary/40 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1" whileTap={{ scale: 0.98 }}>
              {isLoading ? (
                <>
                  <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ loop: Infinity, duration: 1, ease: "linear" }}/>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.p variants={itemVariants} className="text-center text-gray-600">
          Already a member?{' '}
          <a href="/login" className="font-semibold text-care-primary hover:text-care-dark transition-colors">Sign In</a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register;