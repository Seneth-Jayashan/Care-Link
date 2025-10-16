import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// UPDATED: Import AuthContext
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

const Login = () => {
  // --- CONTEXT & NAVIGATION HOOKS ---
  // UPDATED: Get the 'user' object from context
  const { login, isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- UPDATED: ROLE-BASED REDIRECTION LOGIC ---
  useEffect(() => {
    // Check if authentication is complete AND the user object is available
    if (isAuthenticated && user) {
      // Check if we were sent here from a protected page
      const from = location.state?.from?.pathname || null;

      // If coming from a specific page, go back there. Otherwise, role-based redirect.
      if (from) {
        navigate(from, { replace: true });
        return;
      }
      
      // Role-based redirection logic
      switch (user.role) {
        case 'patient':
          navigate('/dashboard/patient', { replace: true });
          break;
        case 'doctor':
          navigate('/dashboard/doctor', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        default:
          // Fallback for other roles or if role is not defined
          navigate('/', { replace: true });
          break;
      }
    }
  }, [isAuthenticated, user, navigate, location.state]); // Add 'user' to the dependency array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const result = await login(formData);
    setIsLoading(false);
    if (!result.success) {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
    // On success, the useEffect hook will handle the redirection automatically
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-care-light via-care-accent to-blue-200 p-4">
      <motion.div
        className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-4xl font-bold text-care-dark tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to continue to Care Link.</p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants} className="relative">
            <FiMail className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange} 
              required 
              className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <FiLock className="absolute w-5 h-5 text-gray-400 top-3 left-0" />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange} 
              required 
              className="w-full bg-transparent border-b-2 border-care-accent/50 focus:border-care-primary transition-colors duration-300 py-2 pl-8 text-care-dark placeholder-gray-400 focus:outline-none"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-end">
              <Link to="/forgot-password" className="text-sm font-semibold text-care-primary hover:text-care-dark transition-colors">
                Forgot Password?
              </Link>
          </motion.div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-sm font-medium text-center text-red-600"
            >
              {error}
            </motion.p>
          )}

          <motion.div variants={itemVariants} className="pt-2">
            <motion.button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-3.5 text-lg font-bold text-white bg-gradient-to-r from-care-primary to-care-dark rounded-xl shadow-lg hover:shadow-xl hover:shadow-care-primary/40 transition-all duration-300 disabled:opacity-50 transform hover:-translate-y-1" whileTap={{ scale: 0.98 }}>
              {isLoading ? (
                <>
                  <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ loop: Infinity, duration: 1, ease: "linear" }}/>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FiLogIn />
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div variants={itemVariants}>
            <div className="flex items-center my-4">
                <hr className="w-full border-gray-300/50" />
                <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                <hr className="w-full border-gray-300/50" />
            </div>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/80 rounded-xl shadow-md border border-white/40 hover:bg-white transition-colors">
                <FcGoogle size={24} />
                <span className="font-medium text-care-dark">Sign in with Google</span>
            </button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-gray-600">
          Not a member yet?{' '}
          <Link to="/register" className="font-semibold text-care-primary hover:text-care-dark transition-colors">
            Sign Up
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;