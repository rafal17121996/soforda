// src/components/DriverCardTab.tsx

import React, { useState, useEffect, useMemo } from "react";

import { DriverCard as DriverCardType } from "../../../types/Worker";
import "./DrivingLicenseTab.css";
import { FaArrowLeft, FaArrowRight, FaPlus } from "react-icons/fa"; // Importing arrow and plus icons
import api from "../../../api/axiosConfig"; // Ensure you have an axios instance
import { toast } from "react-toastify";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import DriverCard from "./Mockups/DriverCard/DriverCard";

interface DriverCardTabProps {
  driverCards: DriverCardType[];
  workerId: number;
  onUpdate?: () => void;
}

const DriverCardTab: React.FC<DriverCardTabProps> = ({
  driverCards,
  onUpdate,
  workerId,
}) => {
  // 1. Sort the drivingLicense array: active first, then by date_issued descending
  const sortedDriverCard = useMemo(() => {
    return [...driverCards].sort((a, b) => {
      // If both licenses are active or inactive, sort by date_issued descending
      if (a.active === b.active) {
        const dateA = new Date(a.date_issued).getTime();
        const dateB = new Date(b.date_issued).getTime();
        return dateB - dateA; // Newest first
      }
      // Active licenses come first
      return a.active ? -1 : 1;
    });
  }, [driverCards]);

  // 2. Initialize currentIndex to 0 (first license in sorted list)
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Reset currentIndex to 0 whenever the sorted list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [sortedDriverCard]);

  // 4. Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sortedDriverCard.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === sortedDriverCard.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 5. Adding a new license
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCard = async () => {
    setIsAdding(true);
    try {
      const payload = { worker_id: workerId };
      await api.post<DriverCardType>("/driver_cards", payload);
      toast.success("New driver card added successfully.");
      if (onUpdate) onUpdate();
      setIsAdding(false);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  // 6. Handle empty license list
  if (sortedDriverCard.length === 0) {
    return (
      <div className="flex flex-col justify-center align-middle">
        <p className="no-license-text">No driver card data available.</p>
        <div className="mr-auto ml-auto pt-3">
          <button
            onClick={handleAddCard}
            className="add-license-button "
            aria-label="Add New Driving License"
            disabled={isAdding}
          >
            {isAdding ? "..." : <FaPlus />}
          </button>
        </div>
      </div>
    );
  }

  // 7. Get the current license to display
  const currentCard = sortedDriverCard[currentIndex];

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
        <DriverCard
          driverCard={currentCard}
        />
        <div className="license-footer">
          <span className="license-counter">
            {currentIndex + 1} / {sortedDriverCard.length}
          </span>
          <button
            onClick={handleAddCard}
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

export default DriverCardTab;
