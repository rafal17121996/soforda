import React from 'react'
import { Tab } from '../Details';

interface PropsTabs {
    renderTabContent: () => JSX.Element | null;
    activeTab: string;
    setActiveTab: (tab: Tab) => void;
}

export const Tabs:React.FC<PropsTabs> = ({renderTabContent, activeTab, setActiveTab}) => {
  return (
    <div>
    <div className="flex border-b mb-4">
      {(["driving_license", "payroll_details", "department"] as Tab[]).map(
        (tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`mr-4 pb-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            } focus:outline-none`}
          >
            {tab === "driving_license"
              ? "Driving License"
              : tab === "payroll_details"
              ? "Payroll Details"
              : "Department"}
          </button>
        )
      )}
    </div>

    {/* Zawartość Zakładek */}
    <div>{renderTabContent()}</div>
  </div>
  )
}
