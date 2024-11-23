import React, { useState } from "react";
import "./DrivingLicense.css";
import { DrivingLicense as DrivingLicenseType } from "../../../../../types/Worker";
import DrivingLicenseFront from "./DrivingLicenseFront";
import DrivingLicenseBack from "./DrivingLicenseBack";

interface DrivingLicenseProps {
  license: DrivingLicenseType;
  onUpdate?: () => void;
}

const DrivingLicense: React.FC<DrivingLicenseProps> = ({ license, onUpdate }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleFlip = () => {
    if (isEditing) return
    setIsFlipped((prev) => !prev);
  };

  const handleIsEditing = (value:boolean) =>{
    setIsEditing(value)
  }

  return (
    <div
      className="license-container"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-label="Driving License Card"
      style={{ position: "relative" }}
    >
      <div className={`license-card ${isFlipped ? "flipped" : ""}`}>
        {!isFlipped ? (
          <DrivingLicenseFront license={license} onUpdate={onUpdate} setIsEditing={handleIsEditing} isEditing={isEditing}/>
        ) : (
          <DrivingLicenseBack license={license} setIsEditing={handleIsEditing} isEditing={isEditing}/>
        )}
      </div>
    </div>
  );
};

export default DrivingLicense;

