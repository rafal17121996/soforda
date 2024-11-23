// src/components/Details.tsx

import React from "react";
import { Worker } from "../../types/Worker";
import DrivingLicenseTab from "./Details/DrivingLicenseTab";
import PayrollDetailsTab from "./Details/PayrollDetailsTab";
import DriverCardTab from "./Details/DriverCardTab";
import Tabs from "./Details/Tabs"; // Ensure correct import
import EmploymentTab from "./Details/EmploymentTab";
import { useAppSelector } from "../../hooks/useAppDispatch";

interface PropsDetails {
  worker: Worker;
  onUpdate: () => void; // Add onUpdate prop
  onUpdatePayrollDetails: () => void;
}


export const Details: React.FC<PropsDetails> = ({ worker, onUpdate, onUpdatePayrollDetails }) => {
  const activeTab = useAppSelector((state) => state.tab.activeTab);

  const renderTabContent = () => {
    switch (activeTab) {
      case "driving_license":
        return (
          <DrivingLicenseTab
            drivingLicense={worker.driving_license}
            onUpdate={onUpdate}
            workerId={worker.id}
          />
        );
      case "payroll_details":
        return <PayrollDetailsTab workerId={worker.id} payrollDetail={worker.payroll_detail} onUpdatePayrollDetails={onUpdatePayrollDetails} />;
      case "driver_card":
        return <DriverCardTab workerId={worker.id} driverCards={worker.driver_card} />;
      case "employment":
        return <EmploymentTab id={worker.id} employment={worker.employments} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Tabs
        renderTabContent={renderTabContent}
      />
    </div>
  );
};

export default Details;
