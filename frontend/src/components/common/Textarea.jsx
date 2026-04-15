import React, { forwardRef } from 'react';
import './Textarea.css';
const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = '',
      rows = 4,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`textarea-field ${className}`}>
        {label && (
          <label className="textarea-label block text-sm font-medium text-secondary-700 mb-2">
            {label}
            {required && <span className="textarea-required text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={`textarea-input w-full px-4 py-2.5 border rounded-lg resize-none transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-secondary-300 hover:border-secondary-400'
          } disabled:bg-secondary-100 disabled:cursor-not-allowed`}
          {...props}
        />

        {(error || helperText) && (
          <p
            className={`textarea-helper mt-1 text-sm ${
              error ? 'text-red-500' : 'text-secondary-500'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;