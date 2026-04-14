// src/components/common/Card.jsx
import React from 'react';

const Card = ({
  children,
  className = '',
  padding = true,
  hover = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-lg shadow-soft border border-secondary-100
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-medium transition-shadow cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-secondary-900 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm text-secondary-500 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-secondary-100 ${className}`}>
    {children}
  </div>
);

export default Card;