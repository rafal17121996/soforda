import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  autoComplete?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({ id, type, label, autoComplete, register, error }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        {...register}
        className={`appearance-none relative block w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 focus:z-10 sm:text-sm`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
