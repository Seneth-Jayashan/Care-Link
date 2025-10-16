// src/pages/auth/Logout.jsx

import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust the import path as needed

const Logout = () => {
  // Get the logout function and authentication status from the context
  const { logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated before attempting to log out
    if (isAuthenticated) {
      logout();
    }
    // Always redirect to the login page, even if the user wasn't logged in
    navigate('/login');
  }, [logout, isAuthenticated, navigate]);

  // This component performs an action and redirects, so it renders nothing.
  return null;
};

export default Logout;