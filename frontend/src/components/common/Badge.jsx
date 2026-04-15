import React from 'react';
import './Badge.css';
const variants = {
  default: 'bg-secondary-100 text-secondary-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700'
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm'
};

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  removable = false,
  onRemove,
  className = ''
}) => {
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span
      className={`badge-base inline-flex items-center font-medium rounded-full ${variantClasses} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span className="badge-dot w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-60" />
      )}

      <span className="badge-text">{children}</span>

      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="badge-remove-button ml-1.5 hover:opacity-70 focus:outline-none"
        >
          <svg
            className="badge-remove-icon w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;