// src/App.jsx

import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import DashboardLayout from './components/Layout/DashboardLayout'; // 1. Import the new layout

// Pages & Components
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Logout from './pages/auth/Logout';

import RoleBasedAccess from './components/Auth/RoleBasedAccess';
import NotFound from './pages/NotFound';

// Example Protected Pages
const DoctorDashboard = () => <div><h1>Doctor Dashboard Content</h1></div>;
const PatientDashboard = () => <div><h1>Patient Dashboard Content</h1></div>;
const AdminPanel = () => <div><h1>Admin Panel Content</h1></div>;
const Appointments = () => <div><h1>My Appointments</h1></div>;


function App() {
  return (
    <Routes>
      {/* --- Public Routes (use MainLayout with Header/Footer) --- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/logout" element={<Logout />} />
      </Route>



      {/* --- NEW: Protected Routes (use DashboardLayout with Sidebar) --- */}
      <Route element={<DashboardLayout />}>
        <Route 
          path="/dashboard/patient"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <PatientDashboard />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/dashboard/doctor"
          element={
            <RoleBasedAccess allowedRoles={['doctor']}>
              <DoctorDashboard />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/admin"
          element={
            <RoleBasedAccess allowedRoles={['admin']}>
              <AdminPanel />
            </RoleBasedAccess>
          } 
        />
        {/* You can add more dashboard-related routes here */}
        <Route 
          path="/appointments"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <Appointments />
            </RoleBasedAccess>
          } 
        />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound/>} />
    </Routes>
  );
}

export default App;