// src/components/auth/RoleBasedAccess.jsx

import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as needed
import { motion } from 'framer-motion';

const RoleBasedAccess = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Show a loading state while user data is being fetched
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="w-16 h-16 border-4 border-care-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ loop: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );
  }

  // 2. If user is not authenticated, redirect them to the login page
  // We also pass the page they were trying to access in the state
  // so they can be redirected back after a successful login.
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Check if the user's role is in the list of allowed roles
  const isAuthorized = user && allowedRoles.includes(user.role);

  // 4. If the user is authorized, render the child components (the protected page)
  if (isAuthorized) {
    return children;
  }

  // 5. If the user is authenticated but NOT authorized, show an access denied message
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-care-light text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-6xl font-bold text-red-500">🚫</h1>
        <h2 className="mt-4 text-4xl font-bold text-care-dark">Access Denied</h2>
        <p className="mt-2 text-lg text-gray-600">
          You do not have permission to view this page.
        </p>
        <Navigate to="/" replace /> 
        {/* We can also redirect them to the home page after a delay */}
      </motion.div>
    </div>
  );
};

export default RoleBasedAccess;