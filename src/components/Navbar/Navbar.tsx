// src/components/Navbar.tsx
import React from "react";
import { NavItem } from "./NavItem";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import { logout } from "../../store/authSlice";
import { NavItemWithSubmenu } from "./NavItemWithSubmenu";

export const Navbar: React.FC = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    console.log("Logout button clicked");
    dispatch(logout());
  };

  return (
    <div className="relative w-[160px]">
      <nav className="h-screen  bg-gray-900 p-4 rounded-r-lg shadow-lg shadow-gray-900">
        <div className="h-full container mx-auto flex">
          <ul className="h-full flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              {isAuthenticated && user ? (
                <p className="px-3 py-2 text-sm font-medium text-gray-300">
                  {user.name}
                </p>
              ) : null}
              <li>
                <NavItem to="/" label="Home" />
              </li>
              <li>
                <NavItem to="/worker" label="Workers" />
              </li>
              <li>
                <NavItemWithSubmenu
                  label="Admin"
                  subItems={[
                    { to: "/admin/users", label: "Users" },
                    { to: "/admin/roles", label: "Roles" },
                    { to: "/admin/companies", label: "Companies" },
                    { to: "/admin/departments", label: "Departments" },
                  ]}
                />
              </li>
            </div>
            <div>
              {isAuthenticated ? (
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-sky-500"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li>
                  <NavItem to="/login" label="Login" />
                </li>
              )}
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
};
