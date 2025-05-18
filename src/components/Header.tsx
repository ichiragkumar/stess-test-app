import React from 'react';
import { Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              API Stress Tester
            </h1>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Build better APIs through stress testing
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;