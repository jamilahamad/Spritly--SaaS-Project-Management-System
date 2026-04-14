// src/components/common/EmptyState.jsx
import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {Icon && (
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-secondary-400" />
        </div>
      )}
      
      <h3 className="text-lg font-medium text-secondary-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-secondary-500 mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;