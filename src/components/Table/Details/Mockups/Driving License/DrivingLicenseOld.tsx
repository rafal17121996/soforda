// src/components/DrivingLicense.tsx

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
import { ButtonType } from "../../../../../enums/ButtonType";
import { ButtonComponent } from "../../../../ButtonComponent"; 
import { ActiveIndicator, AddLicenseTypeIcon, ArrowLeftIcon, ArrowRightIcon, DeleteIcon, UserSquareIcon,  } from "../../../../../icons/icons";

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
  // const convertEmptyStringsToNull = (
  //   obj: Record<string, any>
  // ): Record<string, any> => {
  //   const newObj: Record<string, any> = {};
  //   Object.keys(obj).forEach((key) => {
  //     const value = obj[key];
  //     if (typeof value === "string") {
  //       newObj[key] = value.trim() === "" ? null : value;
  //     } else {
  //       newObj[key] = value;
  //     }
  //   });
  //   return newObj;
  // };

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
  //delete driving license
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

  // Inside the DrivingLicense component

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

  // Inside the DrivingLicense component

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
        <div className="license-front">
          <div className="flag-section">
            <span className="fi fi-eu"></span>
            <div className="country-section">
              <span className="country-label">PRAWO JAZDY&nbsp;</span>
              <span className="country-value">
                {isEditingFront ? (
                  <input
                    type="text"
                    name="country"
                    value={
                      licenseData.country === null
                        ? ""
                        : licenseData.country.toUpperCase()
                    }
                    onChange={handleFrontChange}
                    className="input-field-country"
                  />
                ) : (
                  <span className="value-gray">
                    {licenseData.country === null ||
                      licenseData.country.toUpperCase()}
                  </span>
                )}
              </span>
            </div>

            {/* **Edit Button on Front Side** */}
            {!isEditingFront && (
              <ButtonComponent
                label="Edit Driving License"
                type={ButtonType.Icon}
                className="edit-button table-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingFront(true);
                  setIsEditing(true);
                }}
                aria-label="Edit Driving License"
              />
            )}
            {isEditingFront && (
              <div
                className="front-edit-actions"
                style={{ marginLeft: 10, display: "flex", gap: "10px" }}
              >
                <ButtonComponent
                  label="Save"
                  type={ButtonType.Icon}
                  className="save-button table-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveFrontEdit();
                  }}
                />
                <ButtonComponent
                  label="Cancel"
                  type={ButtonType.Icon}
                  className="cancel-button table-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancelFrontEdit();
                  }}
                />
              </div>
            )}
          </div>
          <div className="data-section">
            <UserSquareIcon className="profile-icon" />
            <div className="info-section">
              <div className="info-row">
                <span className="value-blue">1.</span>
                <span className="value">{licenseData.last_name}</span>
              </div>
              <div className="info-row">
                <span className="value-blue">2.</span>
                <span className="value-gray">
                  {licenseData.first_name} {licenseData.middle_name}
                </span>
              </div>
              <div className="info-row">
                <span className="value-blue">3.</span>
                <span className="value">
                  <span className="date-birthday">
                    {licenseData.birthday === null ||
                      new Date(licenseData.birthday).toLocaleDateString()}
                  </span>
                  <span className="place-of-birth">
                    {isEditingFront ? (
                      <input
                        type="text"
                        name="place_of_birth"
                        value={frontFormState.place_of_birth}
                        onChange={handleFrontChange}
                        className="input-field"
                      />
                    ) : (
                      <span className="value-gray">
                        {licenseData.place_of_birth}
                      </span>
                    )}
                  </span>
                </span>
              </div>

              <div className="info-row">
                <span className="value-blue">4a.</span>
                {isEditingFront ? (
                  <input
                    type="date"
                    name="date_issued"
                    value={frontFormState.date_issued}
                    onChange={handleFrontChange}
                    className="input-field"
                    style={{ marginRight: "10px" }}
                  />
                ) : (
                  <span className="value-gray">
                    {licenseData.date_issued === null ||
                      new Date(licenseData.date_issued).toLocaleDateString()}
                  </span>
                )}
                <span className="value-blue">4c.</span>
                {isEditingFront ? (
                  <input
                    type="text"
                    name="place_of_issue"
                    value={frontFormState.place_of_issue}
                    onChange={handleFrontChange}
                    className="input-field"
                  />
                ) : (
                  <span className="value-gray">
                    {licenseData.place_of_issue}
                  </span>
                )}
              </div>
              <div className="info-row">
                <span className="value-blue">4b.</span>
                {isEditingFront ? (
                  <input
                    type="date"
                    name="valid_until"
                    value={frontFormState.valid_until}
                    onChange={handleFrontChange}
                    className="input-field"
                  />
                ) : (
                  <span className="value-gray">
                    {licenseData.valid_until === null ||
                      new Date(licenseData.valid_until).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="info-row">
                <span className="value-blue">5.</span>
                {isEditingFront ? (
                  <input
                    type="text"
                    name="number"
                    value={frontFormState.number}
                    onChange={handleFrontChange}
                    className="input-field"
                  />
                ) : (
                  <span className="value">{licenseData.number}</span>
                )}
              </div>
            </div>
          </div>
          <div className="bottom-section">
            <span className="value-blue">9.</span>
            <span className="value-gray">
              {licenseData.license_types
                .slice() // Create a shallow copy to avoid mutating the original array
                .sort((a, b) => a.type.localeCompare(b.type)) // Sort alphabetically
                .map((lt) => lt.type)
                .join("/")}
            </span>
          </div>
          <ActiveIndicator
            active={licenseData.active}
            onClick={handleToggleActive}
          />
          <button
            className="delete-license-button"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card flip
              handleDeleteLicense();
            }}
            aria-label="Delete Driving License"
            title="Delete Driving License"
          >
            <DeleteIcon />
          </button>
        </div>
        {/* Back Side */}
        <div className="license-back">
          <div className="info-section">
            <table className="license-table">
              <thead>
                <tr>
                  <th
                    className="value-blue-table col-type"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent flipping the card
                      toggleSortOrder();
                    }}
                    style={{ cursor: "pointer", userSelect: "none" }} // Indicate it's clickable
                    title="Click to sort"
                  >
                    9.
                  </th>
                  <th className="value-blue-table col-valid-since">10.</th>
                  <th className="value-blue-table col-valid-till">11.</th>
                  <th className="value-blue-table col-restrictions">12.</th>
                  <th className="actions-header col-actions">
                    {!adding && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (currentRows.length >= rowsPerPage) {
                            // Calculate the target page based on current data
                            const targetPage = Math.ceil(
                              (sortedLicenseTypes.length + 1) / rowsPerPage
                            );
                            setCurrentPage(targetPage);
                            setAdding(true);
                          } else {
                            // Open add row on current page
                            setAdding(true);
                          }
                        }}
                        className="add-button"
                        style={{
                          height: "1.5em",
                          fontSize: "0.875rem",
                          padding: "0 12px",
                        }}
                        aria-label="Add License Type"
                      >
                        <AddLicenseTypeIcon />
                      </button>
                    )}
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentRows.map((type) => {
                  return (
                    <tr key={type.id}>
                      {editingId === type.id ? (
                        <>
                          <td className="value-blue col-type">
                            <input
                              type="text"
                              name="type"
                              value={formState.type}
                              onChange={handleEditChange}
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              className="input-field table-input"
                            />
                          </td>
                          <td className="value-gray col-valid-since">
                            <input
                              type="date"
                              name="valid_since"
                              value={formState.valid_since}
                              onChange={handleEditChange}
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              className="input-field table-input"
                            />
                          </td>
                          <td className="value-gray col-valid-till">
                            <input
                              type="date"
                              name="valid_till"
                              value={formState.valid_till}
                              onChange={handleEditChange}
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              className="input-field table-input"
                            />
                          </td>
                          <td className="value-gray col-restrictions">
                            <input
                              type="text"
                              name="restrictions"
                              value={formState.restrictions}
                              onChange={handleEditChange}
                              onClick={(e) => e.stopPropagation()}
                              onFocus={(e) => e.stopPropagation()}
                              className="input-field table-input"
                            />
                          </td>

                          <td className="actions-cell col-actions">
                            <div className="button-group">
                              <ButtonComponent
                                label="Save"
                                type={ButtonType.Icon}
                                className="save-button table-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSaveEdit(type.id);
                                }}
                              />
                              <ButtonComponent
                                label="Cancel"
                                type={ButtonType.Icon}
                                className="cancel-button table-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelEdit();
                                }}
                              />
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="value-blue col-type">{type.type}</td>
                          <td className="value-gray col-valid-since">
                            {new Date(type.valid_since).toLocaleDateString()}
                          </td>
                          <td className="value-gray col-valid-till">
                            {new Date(type.valid_till).toLocaleDateString()}
                          </td>
                          <td className="value-gray col-restrictions">
                            {type.restrictions}
                          </td>
                          <td className="actions-cell col-actions">
                            <div className="button-group">
                              <ButtonComponent
                                label="Edit Driving License"
                                type={ButtonType.Icon}
                                className="edit-button table-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(type);
                                }}
                              />
                              <ButtonComponent
                                label="Delete Driving License"
                                type={ButtonType.Icon}
                                className="delete-button table-button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(type.id);
                                }}
                              />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
                {/* Additional Row for Adding New License Type */}
                {adding && (
                  <tr className="add-license-row">
                    <td className="value-blue col-type">
                      <input
                        type="text"
                        name="type"
                        placeholder="Type"
                        value={newLicenseType.type}
                        onChange={handleAddChange}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="value-gray col-valid-since">
                      <input
                        type="date"
                        name="valid_since"
                        placeholder="Valid Since"
                        value={newLicenseType.valid_since}
                        onChange={handleAddChange}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="value-gray col-valid-till">
                      <input
                        type="date"
                        name="valid_till"
                        placeholder="Valid Till"
                        value={newLicenseType.valid_till}
                        onChange={handleAddChange}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="value-gray col-restrictions">
                      <input
                        type="text"
                        name="restrictions"
                        placeholder="Restrictions"
                        value={newLicenseType.restrictions}
                        onChange={handleAddChange}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="actions-cell col-actions">
                      <div className="button-group">
                        <ButtonComponent
                          label="Save"
                          type={ButtonType.Icon}
                          className="save-button table-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddLicenseType();
                          }}
                        />
                        <ButtonComponent
                          label="Cancel"
                          type={ButtonType.Icon}
                          className="cancel-button table-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setAdding(false);
                            setIsEditing(false);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="pagination-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPage();
                }}
                className="pagination-button"
                disabled={currentPage === 1}
                aria-label="Previous Page"
              >
                <ArrowLeftIcon />
              </button>

              {/* Page Numbers */}
              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePageSelect(number);
                      }}
                      className={`page-number ${
                        currentPage === number ? "active-page" : ""
                      }`}
                      aria-label={`Page ${number}`}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPage();
                }}
                className="pagination-button"
                disabled={currentPage === totalPages}
                aria-label="Next Page"
              >
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrivingLicense;
