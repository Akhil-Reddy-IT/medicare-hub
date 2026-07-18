import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-navy-900 bg-opacity-40 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-6';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Outer glowing ring */}
        <div className={`${sizeClasses[size]} border-hospital-100 rounded-full animate-pulse`}></div>
        {/* Inner spinning ring */}
        <div className={`absolute top-0 left-0 ${sizeClasses[size]} border-t-hospital-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
      </div>
    </div>
  );
};

export default Loader;
