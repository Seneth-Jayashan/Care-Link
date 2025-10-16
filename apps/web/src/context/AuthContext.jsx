import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api'; // Your configured Axios instance

// Create the context
export const AuthContext = createContext();

// Create a helper function to set the auth token in API headers
const setAuthToken = (token) => {
  if (token) {
    // Apply authorization token to every request if logged in
    api.defaults.headers.common['x-auth-token'] = token;
    localStorage.setItem('token', token);
  } else {
    // Delete auth header
    delete api.defaults.headers.common['x-auth-token'];
    localStorage.removeItem('token');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check for token initially

  // Function to load the authenticated user's data
  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const res = await api.get('/auth/me');
        setUser(res.data); // The 'getMe' controller returns the full user object
        setIsAuthenticated(true);
      } catch (err) {
        // Token is invalid or expired
        setAuthToken(null); // Clear the bad token
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false);
  };

  // Run loadUser on the initial render
  useEffect(() => {
    loadUser();
  }, []);

  // Register User
  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const { token } = res.data;
      setAuthToken(token); // Set token in headers and localStorage
      await loadUser(); // Load the newly registered user's data
      return { success: true };
    } catch (err) {
      console.error(err.response.data);
      setAuthToken(null); // Ensure no token is set on failure
      return { success: false, error: err.response.data.errors[0].msg };
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      const { token } = res.data;
      setAuthToken(token);
      await loadUser();
      return { success: true };
    } catch (err) {
      console.error(err.response.data);
      setAuthToken(null);
      return { success: false, error: err.response.data.errors[0].msg };
    }
  };

  // Logout User
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // You might want to redirect the user to the login page here
  };
  
  // The value provided to the consumer components
  const authContextValue = {
    user,
    isAuthenticated,
    isLoading,
    register,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};