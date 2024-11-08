import React from "react";
import { NavLink } from "react-router-dom";

interface NavItemProps {
  to: string;
  label: string;
}

export const NavItem: React.FC<NavItemProps> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full block px-3 py-2 rounded-md text-sm font-medium ${
          isActive
            ? "text-white bg-sky-700"
            : "text-gray-300 hover:text-white hover:bg-sky-500"
        }`
      }
    >
      {label}
    </NavLink>
  );
};