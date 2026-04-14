// src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ size = 'md', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const Spinner = () => (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-4 border-primary-200" />
      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <Spinner />
        {text && (
          <p className="mt-4 text-secondary-600 animate-pulse">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Spinner />
      {text && (
        <p className="mt-4 text-secondary-600 text-sm">{text}</p>
      )}
    </div>
  );
};

// Skeleton Loader
export const Skeleton = ({ className = '', variant = 'text' }) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'w-10 h-10 rounded-full',
    thumbnail: 'w-full h-32 rounded-lg',
    card: 'w-full h-48 rounded-lg'
  };

  return (
    <div
      className={`
        bg-secondary-200 animate-pulse
        ${variants[variant]} ${className}
      `}
    />
  );
};

export default Loader;