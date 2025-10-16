import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiGrid } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as needed

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext);

  const getInitials = (user) => {
    if (!user || !user.firstName) return '?';
    return `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase();
  };

  // --- NEW: Helper function for role-based dashboard path ---
  const getDashboardPath = (role) => {
    switch (role) {
      case 'patient':
        return '/dashboard/patient';
      case 'doctor':
        return '/dashboard/doctor';
      case 'admin':
        return '/admin';
      default:
        return '/'; // Fallback to home page if role is unknown
    }
  };

  // Determine the correct path once the user object is available
  const dashboardPath = user ? getDashboardPath(user.role) : '/';

  // Animation variants
  const menuVariants = {
    hidden: { x: '100%' },
    visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { x: '100%', transition: { duration: 0.3 } },
  };
  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-care-dark tracking-tight">
            Care Link
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && user ? (
              <>
                {/* --- UPDATED: Link now uses the dynamic dashboardPath --- */}
                <Link to={dashboardPath} className="font-semibold text-gray-700 hover:text-care-primary transition-colors">Dashboard</Link>
                <Link to="/logout" className="font-semibold text-gray-700 hover:text-care-primary transition-colors">Sign Out</Link>
                <Link to="/profile" className="w-10 h-10 bg-care-primary rounded-full flex items-center justify-center text-white font-bold cursor-pointer text-lg">
                  {getInitials(user)}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="font-semibold text-care-primary hover:text-care-dark transition-colors">Sign In</Link>
                <Link to="/register">
                  <motion.button 
                    className="bg-care-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-care-dark transition-colors"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-care-dark">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><FiX size={24} /></motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><FiMenu size={24} /></motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-white/80 backdrop-blur-2xl z-40 shadow-2xl"
          >
            <motion.div 
              className="flex flex-col h-full p-8 pt-24 space-y-6"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.1 }}
            >
              {isAuthenticated && user ? (
                <>
                  <motion.div variants={menuItemVariants} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-care-primary rounded-full flex items-center justify-center text-white font-bold text-xl">{getInitials(user)}</div>
                    <div>
                      <p className="font-bold text-care-dark text-lg">{user.firstName} {user.lastName}</p>
                      <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                  </motion.div>
                  <hr className="border-care-accent" />
                  {/* --- UPDATED: Mobile link also uses the dynamic dashboardPath --- */}
                  <motion.div variants={menuItemVariants}>
                    <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-2xl font-semibold text-gray-700 hover:text-care-primary">
                      <FiGrid /> Dashboard
                    </Link>
                  </motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link to="/logout" onClick={() => setIsOpen(false)} className="flex items-center gap-3 text-2xl font-semibold text-gray-700 hover:text-care-primary">
                      <FiLogOut /> Sign Out
                    </Link>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div variants={menuItemVariants}><Link to="/#features" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-gray-700 hover:text-care-primary">Features</Link></motion.div>
                  <motion.div variants={menuItemVariants}><Link to="/#about" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-gray-700 hover:text-care-primary">About</Link></motion.div>
                  <hr className="border-care-accent" />
                  <motion.div variants={menuItemVariants}><Link to="/login" onClick={() => setIsOpen(false)} className="text-2xl font-semibold text-gray-700 hover:text-care-primary">Sign In</Link></motion.div>
                  <motion.div variants={menuItemVariants}>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="w-full block text-center bg-care-primary text-white font-bold py-3 px-6 rounded-full shadow-lg text-lg">Sign Up</Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;