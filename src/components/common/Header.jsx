import React from 'react';
import { Ship, Menu, Bell, Settings, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#0F1824]/90 backdrop-blur-sm border-b border-[#3BADE5]/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <Ship className="text-[#3BADE5] h-8 w-8 mr-2" />
            <div>
              <h1 className="text-white text-lg font-medium">
                DF Vessel Monitor
              </h1>
              <p className="text-gray-400 text-xs">Pacific Garnet | DFDE</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex space-x-6">
            <a
              href="/"
              className="text-[#3BADE5] px-3 py-1 rounded-md text-sm font-medium border-b-2 border-[#3BADE5]"
            >
              Dashboard
            </a>
            <a
              href="/voyage"
              className="text-gray-300 hover:text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              Voyage
            </a>
            <a
              href="/cargo"
              className="text-gray-300 hover:text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              Cargo
            </a>
            <a
              href="/consumption"
              className="text-gray-300 hover:text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              Consumption
            </a>
            <a
              href="/reports"
              className="text-gray-300 hover:text-white px-3 py-1 rounded-md text-sm font-medium"
            >
              Reports
            </a>
          </nav>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
              <Bell className="h-5 w-5" />
            </button>
            <button className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
              <Settings className="h-5 w-5" />
            </button>
            <button className="flex items-center text-sm text-gray-300 hover:text-white focus:outline-none">
              <User className="h-5 w-5" />
            </button>
            <button className="md:hidden text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
