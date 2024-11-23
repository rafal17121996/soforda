// src/components/ButtonComponent.tsx
import React from "react";
import { ButtonHTMLType, ButtonType } from "../enums/ButtonType";
import { FaEdit, FaKey, FaPlus, FaTrash } from 'react-icons/fa';
import { TbListDetails } from "react-icons/tb";

const DetailsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor" // Ensure the stroke uses currentColor
    {...props}
  >
    <path
      d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
      strokeWidth="1.5"
    />
    <path
      d="M11 7L17 7"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 7L8 7"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 12L8 12"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 17L8 17"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 12L17 12"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11 17L17 17"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor" // Use currentColor
    {...props}
  >
    <path
      d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M13 4L20 11"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 22L22 22"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditDrivinglicenseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor" // Use currentColor
    {...props}
  >
    <path
      d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M13 4L20 11"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M14 22L22 22"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);



const DeleteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor" // Use currentColor
    {...props}
  >
    <path
      d="M19.5 5.5L19.0982 12.0062M4.5 5.5L5.10461 15.5248C5.25945 18.0922 5.33688 19.3759 5.97868 20.299C6.296 20.7554 6.7048 21.1407 7.17905 21.4302C7.85035 21.84 8.68108 21.9631 10 22"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M20 15L13 21.9995M20 22L13 15.0005"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const DeleteDrivingLicenseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    fill="none"
    stroke="currentColor" // Use currentColor
    {...props}
  >
    <path
      d="M19.5 5.5L19.0982 12.0062M4.5 5.5L5.10461 15.5248C5.25945 18.0922 5.33688 19.3759 5.97868 20.299C6.296 20.7554 6.7048 21.1407 7.17905 21.4302C7.85035 21.84 8.68108 21.9631 10 22"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M20 15L13 21.9995M20 22L13 15.0005"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const AddUserIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#FFFFFF"} fill={"none"} {...props}>
    <path d="M12 7.5C12 9.433 10.433 11 8.5 11C6.567 11 5 9.433 5 7.5C5 5.567 6.567 4 8.5 4C10.433 4 12 5.567 12 7.5Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M13.5 11C15.433 11 17 9.433 17 7.5C17 5.567 15.433 4 13.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13.1429 20H3.85714C2.83147 20 2 19.2325 2 18.2857C2 15.9188 4.07868 14 6.64286 14H10.3571C11.4023 14 12.3669 14.3188 13.1429 14.8568" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M19 14V20M22 17L16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const AddWorkerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#FFFFFF"} fill={"none"} {...props}>
    <path d="M13.5 16.0001V14.0623C15.2808 12.6685 16.5 11 16.5 7.41681C16.5 5.09719 16.0769 3 13.5385 3C13.5385 3 12.6433 2 10.4923 2C7.45474 2 5.5 3.82696 5.5 7.41681C5.5 11 6.71916 12.6686 8.5 14.0623V16.0001L4.78401 17.1179C3.39659 17.5424 2.36593 18.6554 2.02375 20.0101C1.88845 20.5457 2.35107 21.0001 2.90639 21.0001H13.0936" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 22L18.5 15M15 18.5H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoadingIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <div className="text-center">
    <div role="status">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-indigo-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
    </div>
</div>
);

const SaveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.0588 8.83333 19 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CancelIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={14}
    height={14}
    color={"#000000"}
    fill={"none"}
    {...props}
  >
    <path
      d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);




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
    [ButtonType.Icon]:
      "text-gray-700 bg-white hover:bg-slate-50",  
  };

  const disabledClasses = "opacity-50 cursor-not-allowed";

  // Mapowanie etykiet na ikony
  const iconMap: { [key: string]: JSX.Element } = {
    "Edit": <EditIcon  />,
    "Temp Pass": <FaKey  />,
    "Delete": <DeleteIcon  />,
    "Add User" : <AddUserIcon/>,
    "Details": <DetailsIcon />,
    "Add Worker": <AddWorkerIcon />,
    "Loading": <LoadingIcon />,
    "Edit Driving License": <EditDrivinglicenseIcon />,
    "Delete Driving License": <DeleteDrivingLicenseIcon />,
    "Save": <SaveIcon />,
    "Cancel": <CancelIcon />,
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
