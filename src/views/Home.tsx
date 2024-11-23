// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      {/* Nagłówek */}
      <h1 className="text-6xl font-extrabold text-white mb-4">
        Elevate Your Experience
      </h1>
      
      {/* Opis */}
      <p className="text-xl text-center text-white mb-8 max-w-3xl">
        Empowering your business with innovative solutions and seamless integration.
      </p>
      
      {/* Przyciski Nawigacyjne */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          to="/login"
          className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
        >
          Get Started
        </Link>

      </div>
    </div>
  );
};

export default Home;
