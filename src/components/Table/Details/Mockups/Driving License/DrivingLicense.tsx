// src/components/DrivingLicense/DrivingLicense.tsx

import React, { useState, useEffect, useMemo } from "react";
import "./DrivingLicense.css";
import {
  DrivingLicense as DrivingLicenseType,
  LicenseType,
} from "../../../../../types/Worker";
import "flag-icons/css/flag-icons.min.css";
import api from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../../../utils/errorHandler";
import DrivingLicenseFront from "./DrivingLicenseFront";
import DrivingLicenseBack from "./DrivingLicenseBack";

interface DrivingLicenseProps {
  license: DrivingLicenseType;
  onUpdate?: () => void;
}

const DrivingLicense: React.FC<DrivingLicenseProps> = ({
  license,
  onUpdate,
}) => {
  // Local state to manage license data
  const [licenseData, setLicenseData] = useState<DrivingLicenseType>(license);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  // State to manage which license type is being edited
  const [editingId, setEditingId] = useState<number | null>(null);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isEditingFront, setIsEditingFront] = useState<boolean>(false); // State for front side editing

  const [frontFormState, setFrontFormState] = useState({
    country: license.country,
    number: license.number,
    date_issued: license.date_issued,
    valid_until: license.valid_until,
    code_95_valid_until: license.code_95_valid_until,
    place_of_birth: license.place_of_birth,
    place_of_issue: license.place_of_issue,
  });

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  // Memoized sorted license types
  const sortedLicenseTypes = useMemo(() => {
    const sorted = [...licenseData.license_types].sort((a, b) => {
      const typeA = a.type.toLowerCase();
      const typeB = b.type.toLowerCase();

      if (typeA < typeB) return sortOrder === "asc" ? -1 : 1;
      if (typeA > typeB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [licenseData.license_types, sortOrder]);

  // State to manage form inputs when editing
  const [formState, setFormState] = useState<LicenseType>({
    id: 0, // Assuming each LicenseType has a unique 'id' field
    driving_license_id: license.id,
    type: "",
    valid_since: "",
    valid_till: "",
    restrictions: "",
  });

  // State to manage adding a new license type
  const [adding, setAdding] = useState<boolean>(false);
  const [newLicenseType, setNewLicenseType] = useState<LicenseType>({
    id: 0, // This will be set by the backend
    driving_license_id: license.id,
    type: "",
    valid_since: "",
    valid_till: "",
    restrictions: "",
  });

  // State to manage the flip state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Function to handle flipping the card
  const handleFlip = () => {
    if (!isEditing) {
      setIsFlipped((prev) => !prev);
    }
  };

  // Update local state if the license prop changes
  useEffect(() => {
    setLicenseData(license);
    setFrontFormState({
      country: license.country,
      number: license.number,
      date_issued: license.date_issued,
      valid_until: license.valid_until,
      code_95_valid_until: license.code_95_valid_until,
      place_of_birth: license.place_of_birth,
      place_of_issue: license.place_of_issue,
    });
  }, [license]);

  const handleFrontChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFrontFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle input changes for editing
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle input changes for adding
  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewLicenseType((prev) => ({ ...prev, [name]: value }));
  };

  // Function to initiate editing
  const handleEdit = (type: LicenseType) => {
    setEditingId(type.id);
    setFormState({ ...type }); // This creates a shallow copy of 'type'
    setIsEditing(true);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormState({
      id: 0,
      driving_license_id: license.id,
      type: "",
      valid_since: "",
      valid_till: "",
      restrictions: "",
    });
    setIsEditing(false);
  };

  // Function to save edited license type
  const handleSaveEdit = async (id: number) => {
    try {
      const { type, valid_since, valid_till, restrictions } = formState;

      // Construct the payload with empty strings converted to null
      const cleanedPayload = {
        type,
        valid_since,
        valid_till,
        restrictions,
      };

      const response = await api.put<{data: LicenseType}>(
        `/license_types/${id}`,
        cleanedPayload
      );

      // Update local state with the updated license type
      setLicenseData((prev) => ({
        ...prev,
        license_types: prev.license_types.map((lt) =>
          lt.id === id ? { ...lt, ...response.data.data } : lt
        ),
        
      }));

      // Reset editing states
      setEditingId(null);
      setIsEditing(false);

      // Reset formState to initial values
      setFormState({
        id: 0,
        driving_license_id: license.id,
        type: "",
        valid_since: "",
        valid_till: "",
        restrictions: "",
      });

      toast.success("License type updated successfully.");

    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error("Error updating license type:", error);
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };
  
  // Delete driving license
  const handleDeleteLicense = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this driving license?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/driving_licenses/${license.id}`);
      toast.success("Driving license deleted successfully.");
      // if (onUpdate) onUpdate();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error("Error deleting driving license:", error);
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };

  // Function to delete a license type
  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this license type?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/license_type/${id}`);

      // Update local state
      setLicenseData((prev) => ({
        ...prev,
        license_types: prev.license_types.filter((lt) => lt.id !== id),
      }));

      toast.success("License type deleted successfully.");

      // Invoke the onUpdate callback to notify parent
      if (onUpdate) onUpdate();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error("Error deleting license type:", error);
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };

  // Function to add a new license type
  const handleAddLicenseType = async () => {
    try {
      const { type, valid_since, valid_till, restrictions } = newLicenseType;

      // Construct the payload with empty strings converted to null
      const cleanedPayload = ({
        type,
        valid_since,
        valid_till,
        restrictions,
        driving_license_id: license.id,
      });

      console.log("Payload for Add:", cleanedPayload); // For debugging purposes

      const response = await api.post<LicenseType>(
        `/license_type`,
        cleanedPayload
      );

      // Update local state
      setLicenseData((prev) => ({
        ...prev,
        license_types: [...prev.license_types, response.data],
      }));

      setAdding(false);
      setIsEditing(false);
      // Reset newLicenseType
      setNewLicenseType({
        id: 0,
        driving_license_id: license.id,
        type: "",
        valid_since: "",
        valid_till: "",
        restrictions: "",
      });

      toast.success("License type added successfully.");

      // Invoke the onUpdate callback to notify parent
      if (onUpdate) onUpdate();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error("Error adding license type:", error);
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };

  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5; // Number of rows per page

  const totalPages = useMemo(() => {
    return Math.ceil(
      (sortedLicenseTypes.length + (adding ? 1 : 0)) / rowsPerPage
    );
  }, [sortedLicenseTypes.length, rowsPerPage, adding]);

  // Get current rows
  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return sortedLicenseTypes.slice(indexOfFirstRow, indexOfLastRow);
  }, [sortedLicenseTypes, currentPage, rowsPerPage]);

  // Handle page change
  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!adding) {
      setCurrentPage(1);
    }
  }, [sortedLicenseTypes.length, sortOrder, adding]);

  // Reset to first page if license_types change
  useEffect(() => {
    setCurrentPage(1);
  }, [licenseData.license_types]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder]);

  useEffect(() => {
    setLicenseData(license);
    setFrontFormState({
      country: license.country || "",
      number: license.number || "",
      date_issued: license.date_issued || "",
      valid_until: license.valid_until || "",
      code_95_valid_until: license.code_95_valid_until || "",
      place_of_birth: license.place_of_birth || "",
      place_of_issue: license.place_of_issue || "",
    });
  }, [license]);

  const handleToggleActive = async () => {
    try {
      const updatedActive = !licenseData.active;
      const payload = { active: updatedActive };
      const response = await api.put<DrivingLicenseType>(
        `/driving_licenses/${license.id}`,
        payload
      );

      setLicenseData(response.data);
      toast.success(
        `Driving license ${
          updatedActive ? "activated" : "deactivated"
        } successfully.`
      );

      if (onUpdate) onUpdate();
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error("Error toggling active status:", error);
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };

  // Function to save front edit
  const handleSaveFrontEdit = async () => {
    try {
      // Construct the payload with updated license details
      const payload = {
        country: frontFormState.country,
        number: frontFormState.number,
        date_issued: frontFormState.date_issued,
        valid_until: frontFormState.valid_until,
        place_of_birth: frontFormState.place_of_birth,
        place_of_issue: frontFormState.place_of_issue,
      };

      console.log("Payload:", payload); // For debugging purposes

      // Send PUT request to update the driving license details
      const response = await api.put<DrivingLicenseType>(
        `/driving_licenses/${license.id}`,
        payload
      );

      // Update local state with the updated license data
      setLicenseData(response.data);

      // Exit edit mode
      setIsEditingFront(false);
      setIsEditing(false);

      // Reset the front form state to reflect updated data
      setFrontFormState({
        country: response.data.country || "",
        number: response.data.number || "",
        date_issued: response.data.date_issued || "",
        valid_until: response.data.valid_until || "",
        code_95_valid_until: response.data.code_95_valid_until || "",
        place_of_birth: response.data.place_of_birth || "",
        place_of_issue: response.data.place_of_issue || "",
      });

      // Show success notification
      toast.success("Driving license updated successfully.");

      // Notify parent component of the update
      if (onUpdate) onUpdate();
    } catch (error: any) {
      // Handle errors and display error notification
      const errorMessage = getErrorMessage(error);
      console.error("Error updating driving license:", error);
      toast.error(`An error occurred: ${errorMessage}`);
    }
  };

  // Function to cancel front edit
  const handleCancelFrontEdit = () => {
    // Exit edit mode
    setIsEditingFront(false);
    setIsEditing(false);

    // Reset the front form state to the current license data
    setFrontFormState({
      country: licenseData.country,
      number: licenseData.number,
      date_issued: licenseData.date_issued,
      valid_until: licenseData.valid_until,
      code_95_valid_until: licenseData.code_95_valid_until,
      place_of_birth: licenseData.place_of_birth,
      place_of_issue: licenseData.place_of_issue,
    });
  };

  return (
    <div
      className="license-container"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-label="Driving License Card"
      onKeyPress={(e) => {
        if (e.key === "Enter") handleFlip();
      }}
      style={{ position: "relative" }}
    >
      <div className={`license-card ${isFlipped ? "flipped" : ""}`}>
        {/* Front Side */}
        <DrivingLicenseFront
          licenseData={licenseData}
          isEditingFront={isEditingFront}
          handleFrontChange={handleFrontChange}
          setIsEditingFront={setIsEditingFront}
          handleSaveFrontEdit={handleSaveFrontEdit}
          handleCancelFrontEdit={handleCancelFrontEdit}
          handleToggleActive={handleToggleActive}
          handleDeleteLicense={handleDeleteLicense}
        />
        {/* Back Side */}
        <DrivingLicenseBack
          sortedLicenseTypes={sortedLicenseTypes}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
          currentRows={currentRows}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          adding={adding}
          setAdding={setAdding}
          newLicenseType={newLicenseType}
          handleAddChange={handleAddChange}
          handleAddLicenseType={handleAddLicenseType}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevPage={handlePrevPage}
          handleNextPage={handleNextPage}
          handlePageSelect={handlePageSelect}
        />
      </div>
    </div>
  );
};

export default DrivingLicense;
