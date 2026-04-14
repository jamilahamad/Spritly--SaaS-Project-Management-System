// src/components/common/Select.jsx
import React, { forwardRef } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  placeholder = 'Select an option',
  className = '',
  required = false,
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 pr-10 border rounded-lg appearance-none
            bg-white transition-colors duration-200 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            ${error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-secondary-300 hover:border-secondary-400'
            }
            disabled:bg-secondary-100 disabled:cursor-not-allowed
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <HiChevronDown className="w-5 h-5 text-secondary-400" />
        </div>
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500' : 'text-secondary-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;