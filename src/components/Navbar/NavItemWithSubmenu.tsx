// src/components/NavItemWithSubmenu.tsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';

interface NavItemWithSubmenuProps {
  label: string;
  subItems: { to: string; label: string }[];
}

export const NavItemWithSubmenu: React.FC<NavItemWithSubmenuProps> = ({
  label,
  subItems,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if any subItem is active
  useEffect(() => {
    const isSubItemActive = subItems.some(
      (subItem) => subItem.to === location.pathname
    );
    if (isSubItemActive) {
      setIsOpen(true);
    }
  }, [location.pathname, subItems]);

  const toggleSubmenu = () => {
    setIsOpen(!isOpen);
  };

  // Determine if any subItem is active
  const isSubItemActive = subItems.some(
    (subItem) => subItem.to === location.pathname
  );

  return (
    <div>
      {/* Main Menu Item */}
      <button
        onClick={toggleSubmenu}
        className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-md text-sm font-medium ${
          isSubItemActive
            ? 'text-white bg-sky-700'
            : 'text-gray-300 hover:text-white hover:bg-sky-500'
        }`}
      >
        {label}
        <FaChevronDown
          className={`ml-2 transform transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {/* Submenu */}
      {isOpen && (
        <div className="ml-4">
          {subItems.map((subItem) => (
            <NavLink
              key={subItem.to}
              to={subItem.to}
              className={({ isActive }) =>
                `block px-2 py-1 rounded-md text-sm font-medium mt-3 ${
                  isActive
                    ? 'text-white bg-sky-700'
                    : 'text-gray-300 hover:text-white hover:bg-sky-500'
                }`
              }
            >
              {subItem.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};
