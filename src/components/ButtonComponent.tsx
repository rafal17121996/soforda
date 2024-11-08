// src/components/ButtonComponent.tsx
import React from "react";
import { ButtonHTMLType, ButtonType } from "../enums/ButtonType";
import { FaEdit, FaKey, FaPlus, FaTrash } from 'react-icons/fa';

interface PropsButtonComponent {
  label: string;
  type?: ButtonType;
  disabled?: boolean;
  buttonType?: ButtonHTMLType;
  onClick?: () => void;
}

export const ButtonComponent: React.FC<PropsButtonComponent> = ({
  label,
  type = ButtonType.Primary,
  disabled = false,
  buttonType = ButtonHTMLType.Button,
  onClick,
}) => {
  const baseClasses =
    "px-2 py-2 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center";

  const typeClasses: { [key in ButtonType]: string } = {
    [ButtonType.Primary]:
      "text-white bg-sky-700 hover:bg-blue-700 focus:ring-blue-500",
    [ButtonType.Secondary]:
      "text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400",
    [ButtonType.Success]:
      "text-white bg-green-600 hover:bg-green-700 focus:ring-green-500",
    [ButtonType.Danger]:
      "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    [ButtonType.Warning]:
      "text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    [ButtonType.Info]:
      "text-white bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Mapowanie etykiet na ikony
  const iconMap: { [key: string]: JSX.Element } = {
    "Edit": <FaEdit  />,
    "Temp Pass": <FaKey  />,
    "Delete": <FaTrash  />,
    "Add User" : <FaPlus/>
  };

  const icon = iconMap[label];

  return (
    <button
      type={buttonType}
      className={`${baseClasses} ${typeClasses[type]} ${
        disabled ? disabledClasses : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon || label}
    </button>
  );
};
