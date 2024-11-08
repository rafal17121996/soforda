// src/components/Details.tsx
import React, { useState } from "react";
import { Worker } from "../../types/Worker";
import DrivingLicenseTab from "./Details/DrivingLicenseTab";
import PayrollDetailsTab from "./Details/PayrollDetailsTab";
import DepartmentTab from "./Details/DepartmentTab";
import { DetailsMainInfo } from "./Details/DetailsMainInfo";
import { Tabs } from "./Details/Tabs";

interface PropsDetails {
  worker: Worker;
}

export type Tab = "driving_license" | "payroll_details" | "department";

export const Details: React.FC<PropsDetails> = ({ worker }) => {
  const [activeTab, setActiveTab] = useState<Tab>("driving_license");

  const renderTabContent = () => {
    switch (activeTab) {
      case "driving_license":
        return <DrivingLicenseTab workerId={worker.id} />;
      case "payroll_details":
        return <PayrollDetailsTab workerId={worker.id} />;
      case "department":
        return <DepartmentTab workerId={worker.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Nagłówek */}
      <h2 className="text-2xl font-semibold mb-4">Szczegóły Pracownika</h2>

      {/* Podstawowe Informacje */}
      <DetailsMainInfo worker={worker} />

      {/* Zakładki */}
      <Tabs renderTabContent={renderTabContent} activeTab={activeTab} setActiveTab= {setActiveTab}/>
    </div>
  );
};

export default Details;
