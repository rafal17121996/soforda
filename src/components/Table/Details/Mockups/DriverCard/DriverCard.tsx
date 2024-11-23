import React from "react";
import { DriverCard as DriverCardType } from "../../../../../types/Worker";
import DriverCardFront from "./DriverCardFront";

interface DriverCardTabProps {
  driverCard: DriverCardType;
}

const DriverCard: React.FC<DriverCardTabProps> = ({ driverCard }) => {
  return (
    <div
      className="license-container"
      role="button"
      tabIndex={0}
      aria-label="Driving License Card"
      style={{ position: "relative" }}
    >
      <div className={`license-card`}>
        <DriverCardFront driverCard={driverCard} />
      </div>
    </div>
  );
};

export default DriverCard;