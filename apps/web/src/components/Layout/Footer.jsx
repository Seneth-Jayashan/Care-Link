// src/components/Layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-care-accent/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-care-dark">Care Link</h3>
            <p className="mt-2 text-gray-500 max-w-md">
              Your Health Journey, Simplified. Connecting patients and doctors across Sri Lanka for a healthier future.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="font-semibold text-care-dark mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-care-primary transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-care-primary transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="text-gray-500 hover:text-care-primary transition-colors">Sign Up</Link></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h4 className="font-semibold text-care-dark mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-care-primary transition-colors"><FiFacebook size={24} /></a>
              <a href="#" className="text-gray-500 hover:text-care-primary transition-colors"><FiTwitter size={24} /></a>
              <a href="#" className="text-gray-500 hover:text-care-primary transition-colors"><FiLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        <hr className="my-8 border-care-accent/50" />

        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Care Link. All Rights Reserved. Made with ❤️ in Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;