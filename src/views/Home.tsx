// src/pages/Home.tsx
import React from "react";
import { Link } from "react-router-dom";

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Nagłówek */}
      <h1 className="text-5xl font-bold mb-6 text-gray-800">
        Witaj w Naszej Aplikacji
      </h1>
      
      {/* Opis */}
      <p className="text-lg text-center mb-8 max-w-2xl text-gray-600">
        Hallo Arschloch dolor sit amet, consectetur adipiscing elit. Donec vel
        gravida arcu. Vestibulum feugiat, sapien ultrices fermentum congue,
        quam velit venenatis sem, sit amet aliquam massa nisl quis neque. Fusce
        ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus,
        ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit.
      </p>
      
      {/* Przyciski Nawigacyjne */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Link
          to="/login"
          className="w-48 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-center"
        >
          Zaloguj się
        </Link>

      </div>
    </div>
  );
};

export default Home;
