// src/components/ButtonComponent.tsx
import React from "react";
import { ButtonHTMLType, ButtonType } from "../enums/ButtonType";
import { FaKey } from "react-icons/fa";

import {
  AddUserIcon,
  AddWorkerIcon,
  CancelIcon,
  DeleteDrivingLicenseIcon,
  DeleteIcon,
  DetailsIcon,
  EditDrivinglicenseIcon,
  EditIcon,
  LoadingIcon,
  SaveIcon,
} from "../icons/buttonIcons";

interface PropsButtonComponent {
  label: string;
  text?: string;
  type?: ButtonType;
  disabled?: boolean;
  buttonType?: ButtonHTMLType;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

export const ButtonComponent: React.FC<PropsButtonComponent> = ({
  label,
  text,
  type = ButtonType.Primary,
  disabled = false,
  buttonType = ButtonHTMLType.Button,
  onClick,
  className = "",
}) => {
  const baseClasses =
    "px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center";

  const typeClasses: { [key in ButtonType]: string } = {
    [ButtonType.Primary]:
      "bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300",
    [ButtonType.Info]:
      "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-gray-300",
    [ButtonType.Danger]:
      "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-red-500",
    [ButtonType.Success]:
      "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-green-500",
    [ButtonType.Warning]:
      "text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-yellow-500",
    [ButtonType.Secondary]:
      "text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400",
    [ButtonType.Icon]: "text-gray-700 bg-white hover:bg-slate-50",
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Mapowanie etykiet na ikony
  const iconMap: { [key: string]: JSX.Element } = {
    Edit: <EditIcon />,
    "Temp Pass": <FaKey />,
    Delete: <DeleteIcon />,
    "Add User": <AddUserIcon />,
    Details: <DetailsIcon />,
    "Add Worker": <AddWorkerIcon />,
    Loading: <LoadingIcon />,
    "Edit Driving License": <EditDrivinglicenseIcon />,
    "Delete Driving License": <DeleteDrivingLicenseIcon />,
    Save: <SaveIcon />,
    Cancel: <CancelIcon />,
  };

  const icon = iconMap[label];

  return (
    <button
      type={buttonType}
      className={`${baseClasses} ${typeClasses[type]} ${
        disabled ? disabledClasses : ""
      } ${className}`} // Append custom className
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="icon">{icon}</span>}
      {text && <span className="text">{text}</span>}
    </button>
  );
};
