import React from 'react';
import { Settings } from 'lucide-react';

const DashboardCard = ({
  title,
  children,
  isLoading = false,
  onConfigure = null,
}) => {
  return (
    <div className="card p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-white">{title}</h2>
        {onConfigure && (
          <button
            onClick={onConfigure}
            className="text-gray-400 hover:text-white"
          >
            <Settings size={16} />
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3BADE5]"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default DashboardCard;
