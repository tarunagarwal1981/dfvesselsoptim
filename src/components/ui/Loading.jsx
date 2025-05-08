import React from 'react';

const Loading = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClass =
    size === 'small' ? 'h-4 w-4' : size === 'large' ? 'h-12 w-12' : 'h-8 w-8';

  return (
    <div className="flex flex-col items-center">
      <div
        className={`animate-spin rounded-full ${sizeClass} border-b-2 border-[#3BADE5]`}
      ></div>
      {message && <p className="mt-4 text-gray-400">{message}</p>}
    </div>
  );
};

export default Loading;
