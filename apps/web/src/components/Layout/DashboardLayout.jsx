// src/components/Layout/DashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; // Assuming Sidebar.jsx is in the same folder

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-care-light">
      {/* The Sidebar is fixed on the left side */}
      <Sidebar />

      {/* This is the main content area for the dashboard.
        - `flex-grow` makes it take up all remaining space.
        - `ml-64` is crucial. It adds a left margin equal to the sidebar's width (w-64),
          preventing the main content from being hidden underneath the fixed sidebar.
        - `p-8` adds some nice padding around your page content.
      */}
      <main className="flex-grow p-8 ml-64">
        {/* The <Outlet /> component renders the actual page component
            (e.g., PatientDashboard, DoctorDashboard) defined in your routes. */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;