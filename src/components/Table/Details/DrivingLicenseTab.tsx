// src/components/DrivingLicenseTab.tsx

import React, { useState, useEffect, useMemo } from "react";
import DrivingLicense from "./Mockups/Driving License/DrivingLicense";
import { DrivingLicense as DrivingLicenseType } from "../../../types/Worker";
import "./DrivingLicenseTab.css";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa"; // Importing arrow and plus icons
import api from "../../../api/axiosConfig"; // Ensure you have an axios instance
import { toast } from "react-toastify";

interface DrivingLicenseTabProps {
  drivingLicense: DrivingLicenseType[];
  workerId: number;
  onUpdate?: () => void;
}

const DrivingLicenseTab: React.FC<DrivingLicenseTabProps> = ({
  drivingLicense,
  onUpdate,
  workerId,
}) => {
  // 1. Sort the drivingLicense array: active first, then by date_issued descending
  const sortedDrivingLicenses = useMemo(() => {
    return [...drivingLicense].sort((a, b) => {
      // If both licenses are active or inactive, sort by date_issued descending
      if (a.active === b.active) {
        const dateA = new Date(a.date_issued).getTime();
        const dateB = new Date(b.date_issued).getTime();
        return dateB - dateA; // Newest first
      }
      // Active licenses come first
      return a.active ? -1 : 1;
    });
  }, [drivingLicense]);

  // 2. Initialize currentIndex to 0 (first license in sorted list)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Reset currentIndex to 0 whenever the sorted list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [sortedDrivingLicenses]);

  // 4. Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sortedDrivingLicenses.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sortedDrivingLicenses.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 5. Adding a new license
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLicense = async () => {
    const confirmAdd = window.confirm(
      "Are you sure you want to add a new driving license?"
    );
    if (!confirmAdd) return;

    setIsAdding(true);
    try {
      const payload = { worker_id: workerId };
      await api.post<DrivingLicenseType>("/driving_licenses", payload);
      toast.success("New driving license added successfully.");
      if (onUpdate) onUpdate();
      setIsAdding(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add new driving license.";
      console.error("Error adding new driving license:", error);
      toast.error(`An error occurred: ${errorMessage}`);
      setIsAdding(false);
    }
  };

  // 6. Handle empty license list
  if (sortedDrivingLicenses.length === 0) {
    return (
      <p className="no-license-text">No driving license data available.</p>
    );
  }

  // 7. Get the current license to display
  const currentLicense = sortedDrivingLicenses[currentIndex];

  return (
    <div className="license-tab-container">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        className="nav-button prev-button"
        aria-label="Previous License"
      >
        <FaArrowLeft />
      </button>

      {/* Driving License Content */}
      <div className="license-content">
        <DrivingLicense
          key={currentLicense.id}
          license={currentLicense}
          onUpdate={onUpdate}
        />
        <div className="license-footer">
          <span className="license-counter">
            {currentIndex + 1} / {sortedDrivingLicenses.length}
          </span>
          <button
            onClick={handleAddLicense}
            className="add-license-button"
            aria-label="Add New Driving License"
            disabled={isAdding}
          >
            {isAdding ? "..." : <FaPlus />}
          </button>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="nav-button next-button"
        aria-label="Next License"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default DrivingLicenseTab;