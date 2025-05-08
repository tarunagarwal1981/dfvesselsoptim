import React from 'react';
import { Calendar } from 'lucide-react';

const DateRangePicker = ({
  mode,
  singleDate,
  startDate,
  endDate,
  onDateChange,
  onModeChange,
  availableDates = [],
  isDateAvailable = () => true, // Default function that allows all dates
}) => {
  // Check if a date is available
  const checkDateAvailability = (dateStr) => {
    if (Array.isArray(availableDates) && availableDates.length > 0) {
      return availableDates.includes(dateStr);
    }
    return isDateAvailable(dateStr);
  };

  // CSS classes for disabled dates
  const getDateInputClasses = (dateStr) => {
    const isAvailable = checkDateAvailability(dateStr);
    return `input ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`;
  };

  return (
    <div className="flex items-center space-x-3 bg-[#132337] p-2 rounded-lg">
      {mode === 'daily' ? (
        <div className="flex items-center">
          <label className="text-xs text-gray-400 mr-2">Date:</label>
          <input
            type="date"
            value={singleDate}
            onChange={(e) => {
              const newDate = e.target.value;
              if (checkDateAvailability(newDate)) {
                onDateChange(newDate, 'singleDate');
              } else {
                // Show a message or tooltip that this date has no data
                console.log('No data available for this date');
              }
            }}
            className={getDateInputClasses(singleDate)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center">
            <label className="text-xs text-gray-400 mr-2">From:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                const newDate = e.target.value;
                onDateChange(newDate, 'startDate');
              }}
              className="input"
            />
          </div>
          <div className="flex items-center">
            <label className="text-xs text-gray-400 mr-2">To:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                const newDate = e.target.value;
                onDateChange(newDate, 'endDate');
              }}
              className="input"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;
