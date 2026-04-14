// src/components/common/Dropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown } from 'react-icons/hi';

const Dropdown = ({
  trigger,
  children,
  position = 'bottom-left',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positions = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50">
            Select
            <HiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`
            absolute ${positions[position]} z-50 min-w-[200px]
            bg-white rounded-lg shadow-lg border border-secondary-200
            py-2 fade-in
          `}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return null;

            return React.cloneElement(child, {
              onClick: (e) => {
                child.props.onClick?.(e);
                setIsOpen(false);
              }
            });
          })}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({
  children,
  icon: Icon,
  danger = false,
  onClick,
  disabled = false
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex items-center gap-3 px-4 py-2 text-left text-sm
      transition-colors disabled:opacity-50 disabled:cursor-not-allowed
      ${danger
        ? 'text-red-600 hover:bg-red-50'
        : 'text-secondary-700 hover:bg-secondary-50'
      }
    `}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {children}
  </button>
);

// Dropdown Divider Component
export const DropdownDivider = () => (
  <div className="my-2 border-t border-secondary-200" />
);

export default Dropdown;