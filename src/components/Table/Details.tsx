// src/components/Details.tsx
import React, { useState } from "react";
import { Worker } from "../../types/Worker";
import DrivingLicenseTab from "./Details/DrivingLicenseTab";
import PayrollDetailsTab from "./Details/PayrollDetailsTab";
import DriverCardTab from "./Details/DriverCardTab";
import { Tabs } from "./Details/Tabs";
import { EmploymentTab } from "./Details/EmploymentTab";

interface PropsDetails {
  worker: Worker;
}

export type Tab = "driving_license" | "payroll_details" | "driver_card" | "employment";

export const Details: React.FC<PropsDetails> = ({ worker }) => {
  const [activeTab, setActiveTab] = useState<Tab>("driving_license");

  const renderTabContent = () => {
    switch (activeTab) {
      case "driving_license":
        return <DrivingLicenseTab drivingLicense={worker.driving_license} />;
      case "payroll_details":
        return <PayrollDetailsTab payrollDetail={worker.payroll_detail} />;
      case "driver_card":
        return <DriverCardTab driverCards={worker.driver_card} />;
      case "employment":
        return <EmploymentTab  />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Tabs renderTabContent={renderTabContent} activeTab={activeTab} setActiveTab= {setActiveTab}/>
    </div>
  );
};

export default Details;
