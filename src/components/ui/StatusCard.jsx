import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatusCard = ({
  title,
  value,
  unit,
  icon,
  trend = null,
  isLoading = false,
  onClick = null,
  className = '',
}) => {
  // Handle N/A, undefined, null values
  const displayValue = value === 0 || value ? value : 'N/A';
  const shouldShowUnit = displayValue !== 'N/A' && unit;

  return (
    <div
      className={`bg-[#132337]/50 p-3 rounded-lg ${className} ${
        onClick ? 'cursor-pointer hover:bg-[#132337]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center text-gray-400 text-xs mb-1">
        {icon}
        <span className="ml-1">{title}</span>
      </div>

      <div className="flex items-center">
        {isLoading ? (
          <div className="h-6 w-16 bg-gray-800 animate-pulse rounded"></div>
        ) : (
          <div className="flex items-center">
            <span className="text-base font-medium text-white">
              {displayValue}
            </span>
            {shouldShowUnit && (
              <span className="text-gray-400 text-xs ml-1">{unit}</span>
            )}

            {displayValue !== 'N/A' && trend === 'up' && (
              <ArrowUp size={14} className="ml-2 text-red-400" />
            )}
            {displayValue !== 'N/A' && trend === 'down' && (
              <ArrowDown size={14} className="ml-2 text-green-400" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
