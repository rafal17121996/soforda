// src/components/NavItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
          isActive
            ? "text-indigo-600 font-semibold"
            : "text-gray-700 hover:text-indigo-600"
        }`
      }
    >
      {label}
    </NavLink>
  );
};

export default NavItem;
