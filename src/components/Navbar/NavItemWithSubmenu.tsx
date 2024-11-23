// src/components/NavItemWithSubmenu.tsx
import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

interface SubItem {
  to: string;
  label: string;
}

interface NavItemWithSubmenuProps {
  label: string;
  subItems: SubItem[];
}

const NavItemWithSubmenu: React.FC<NavItemWithSubmenuProps> = ({
  label,
  subItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Check if any subItem is active
  const isSubItemActive = subItems.some(
    (subItem) => window.location.pathname === subItem.to
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
          isSubItemActive
            ? "text-indigo-600 font-semibold"
            : "text-gray-700 hover:text-indigo-600"
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}
        <FaChevronDown
          className={`ml-1 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20"
          role="menu"
          aria-label={`${label} submenu`}
        >
          {subItems.map((subItem) => (
            <NavLink
              key={subItem.to}
              to={subItem.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm transition-colors duration-300 ${
                  isActive
                    ? "text-indigo-600 bg-gray-100"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                }`
              }
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {subItem.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItemWithSubmenu;
