// src/components/Layout/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-care-light">
      {/* The floating header sits on top */}
      <Header />

      {/* The <main> tag holds the page content.
        - `flex-grow` makes it expand to fill available space, pushing the footer down.
        - `pt-20` adds padding to the top to prevent content from being hidden underneath the fixed header.
          You can adjust this value (e.g., pt-24) to match your header's exact height.
      */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* The footer is at the bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;