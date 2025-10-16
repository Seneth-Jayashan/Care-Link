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

import DoctorDashboard from './pages/doctors/Dashboard';

import PatientDashboard from './pages/patients/Dashboard';
import PatientAppointment from './pages/patients/Appointment';
import Doctors from './pages/patients/Doctors';
import PatientPayment from './pages/patients/Payment';
import PatientFeedback from './pages/patients/Feedback';
import PatientBooking from './pages/patients/BookingPage';
import PatientProfile from './pages/patients/Profile';

import AdminPanel from './pages/admin/Dashboard';



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
          path="/patient/appointments"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <PatientAppointment />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/patient/payments"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <PatientPayment />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/patient/doctors"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <Doctors />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/patient/feedback"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <PatientFeedback />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/patient/booking/:id"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <PatientBooking />
            </RoleBasedAccess>
          } 
        />
        <Route 
          path="/patient/profile"
          element={
            <RoleBasedAccess allowedRoles={['patient']}>
              <PatientProfile />
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