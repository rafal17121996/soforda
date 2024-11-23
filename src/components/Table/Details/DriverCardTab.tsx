// src/components/DriverCardTab.tsx

import React from "react";
import { DriverCard } from "../../../types/Worker";
import DriverCardFront from "./Mockups/DriverCard/DriverCardFront";

interface DriverCardTabProps {
  driverCards: DriverCard[];
}

const DriverCardTab: React.FC<DriverCardTabProps> = ({ driverCards }) => {
  return (
    <div
      className="license-container"
      role="button"
      tabIndex={0}
      aria-label="Driving License Card"
      style={{ position: "relative" }}
    >
      <div className={`license-card`}>
        <DriverCardFront driverCards={driverCards} />
      </div>
    </div>
  );
};

export default DriverCardTab;
