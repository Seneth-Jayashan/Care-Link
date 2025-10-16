import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust path as needed
import { FiGrid, FiCalendar, FiFileText, FiUsers, FiSettings, FiLogOut, FiShield } from 'react-icons/fi';
import { TbReport } from "react-icons/tb";
import { VscFeedback } from "react-icons/vsc";


const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  // Define navigation links for each role
  const patientLinks = [
    { name: 'Dashboard', path: '/dashboard/patient', icon: <FiGrid /> },
    { name: 'Appointments', path: '/patient/appointments', icon: <FiCalendar /> },
    { name: 'Payments', path: '/patient/payments', icon: <FiFileText /> },
    { name: 'Find Doctors', path: '/patient/doctors', icon: <FiUsers /> },
    { name: 'Feedback', path: '/patient/feedback', icon: <VscFeedback  /> },
  ];

  const doctorLinks = [
    { name: 'Dashboard', path: '/dashboard/doctor', icon: <FiGrid /> },
    { name: 'Schedule', path: '/doctor/schedule', icon: <FiCalendar /> },
    { name: 'My Patients', path: '/doctor/patients', icon: <FiUsers /> },
    { name: 'Reports', path: '/doctor/reports', icon: <TbReport /> },
  ];
  
  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard/admin', icon: <FiShield /> },
    { name: 'Manage Users', path: '/admin/users', icon: <FiUsers /> },
    { name: 'Manage Doctors', path: '/admin/doctors', icon: <FiUsers /> },
  ];

  const hcpLinks = [
    { name: 'Dashboard', path: '/dashboard/hcprovider', icon: <FiShield /> },
    { name: 'Manage Users', path: '/hcprovider/users', icon: <FiUsers /> },
    { name: 'Manage Doctors', path: '/hcprovider/doctors', icon: <FiUsers /> },
  ];

    const hcmLinks = [
    { name: 'Dashboard', path: 'dashboard/hcmanager', icon: <FiShield /> },
    { name: 'Manage Users', path: '/hcmanager/users', icon: <FiUsers /> },
    { name: 'Manage Doctors', path: '/hcmanager/doctors', icon: <FiUsers /> },
  ];

  // Determine which links to show based on user role
  let navLinks = [];
  if (user) {
    switch (user.role) {
      case 'patient':
        navLinks = patientLinks;
        break;
      case 'doctor':
        navLinks = doctorLinks;
        break;
      case 'admin':
        navLinks = adminLinks;
        break;
      case 'hcprovider':
        navLinks = hcpLinks;
        break;
      case 'hcmanager':
        navLinks = hcmLinks;
        break;
      default:
        navLinks = [];
    }
  }

  // A reusable component for the navigation links to avoid repetition
  const NavItem = ({ path, icon, name }) => (
    <NavLink
      to={path}
      // The `className` function gets an `isActive` property from NavLink
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors duration-200 ${
          isActive
            ? 'bg-care-primary text-white shadow-lg'
            : 'text-gray-500 hover:bg-care-accent hover:text-care-dark'
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span>{name}</span>
    </NavLink>
  );

  return (
    <aside className="h-screen w-64 bg-white shadow-lg flex flex-col fixed">
      <div className="px-6 py-5 border-b border-care-accent">
        <Link to="/" className="text-3xl font-bold text-care-dark tracking-tight">
          Care Link
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map((link) => (
          <NavItem key={link.name} {...link} />
        ))}
      </nav>

      {/* User Profile and Logout Section */}
      <div className="p-4 border-t border-care-accent">
        <div className="flex items-center gap-3 mb-4">
          <Link 
              to={user ? `/${user.role}/profile` : '#'} 
              className="flex items-center gap-3 mb-4"
          >
            <div className="w-10 h-10 bg-care-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-bold text-care-dark">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</p>
              <p className="text-sm text-gray-500">{user ? user.email : ''}</p>
            </div>
          </Link>
        </div>
        <Link
          to="/logout"
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg font-semibold text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
        >
          <FiLogOut className="text-xl" />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;