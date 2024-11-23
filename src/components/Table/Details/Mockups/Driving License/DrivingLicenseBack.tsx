import React, { useState, useEffect, useMemo } from "react";
import {
  DrivingLicense as DrivingLicenseType,
  LicenseType,
} from "../../../../../types/Worker";
import { ButtonComponent } from "../../../../ButtonComponent";
import { ButtonType } from "../../../../../enums/ButtonType";
import {
  AddLicenseTypeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "../../../../../icons/icons";
import api from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";

interface DrivingLicenseBackProps {
  license: DrivingLicenseType;
  setIsEditing: (value: boolean) => void;
  isEditing: boolean;
}

const DrivingLicenseBack: React.FC<DrivingLicenseBackProps> = ({
  license,
  setIsEditing,
}) => {



  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>(
    license.license_types || []
  );
  const [editingId, setEditingId] = useState<number | null>(null);
  const [adding, setAdding] = useState<boolean>(false);
  const [newLicenseType, setNewLicenseType] = useState<LicenseType>({
    id: 0,
    driving_license_id: license.id,
    type: "",
    valid_since: "",
    valid_till: "",
    restrictions: "",
  });
  const [formState, setFormState] = useState<LicenseType>({
    id: 0,
    driving_license_id: license.id,
    type: "",
    valid_since: "",
    valid_till: "",
    restrictions: "",
  });

  const sortedLicenseTypes = useMemo(() => {
    return [...licenseTypes].sort((a, b) => {
      const typeA = a.type.toLowerCase();
      const typeB = b.type.toLowerCase();
      if (typeA < typeB) return -1;
      if (typeA > typeB) return 1;
      return 0;
    });
  }, [licenseTypes]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(
    (sortedLicenseTypes.length + (adding ? 1 : 0)) / rowsPerPage
  );

  const currentRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedLicenseTypes.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedLicenseTypes, currentPage]);

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
    setLicenseTypes(license.license_types || []);
  }, [license.license_types]);

  useEffect(() => {
    if (adding) {
      setCurrentPage(totalPages);
    }
    if(currentPage > totalPages) 
      setCurrentPage(totalPages);
  }, [adding, currentPage, totalPages]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLicenseType((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (type: LicenseType) => {
    setEditingId(type.id);
    setFormState({ ...type });
    setIsEditing(true);
  };

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

  const handleSaveEdit = async (id: number) => {
    try {
      const payload = {
        type: formState.type,
        valid_since: formState.valid_since,
        valid_till: formState.valid_till,
        restrictions: formState.restrictions,
      };

      const response = await api.put<{ data: LicenseType }>(
        `/license_types/${id}`,
        payload
      );

      setLicenseTypes((prev) =>
        prev.map((lt) => (lt.id === id ? { ...lt, ...response.data.data } : lt))
      );

      setEditingId(null);
      setIsEditing(false);
      toast.success("License type updated successfully.");
      // if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this license type?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/license_type/${id}`);
      setLicenseTypes((prev) => prev.filter((lt) => lt.id !== id));
      toast.success("License type deleted successfully.");
      // if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleAddLicenseType = async () => {
    try {
      const payload = {
        type: newLicenseType.type,
        valid_since: newLicenseType.valid_since,
        valid_till: newLicenseType.valid_till,
        restrictions: newLicenseType.restrictions,
        driving_license_id: license.id,
      };

      const response = await api.post<{ data: LicenseType }>(
        `/license_type`,
        payload
      );
      setLicenseTypes((prev) => [...prev, response.data.data]);
      setAdding(false);
      setIsEditing(false);
      setNewLicenseType({
        id: 0,
        driving_license_id: license.id,
        type: "",
        valid_since: "",
        valid_till: "",
        restrictions: "",
      });
      toast.success("License type added successfully.");
      // if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleEnableLicenseType = () => {
    setIsEditing(true);
    setAdding(true);
  };

  return (
    <div className="license-back">
      <div className="info-section">
        <table className="license-table">
          <thead>
            <tr>
              <th
                className="value-blue-table col-type"
                style={{ cursor: "pointer", userSelect: "none" }}
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
                      handleEnableLicenseType();
                    }}
                    className="flex justify-center w-full"
                    aria-label="Add License Type"
                  >
                    <AddLicenseTypeIcon />
                  </button>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((type) => (
              <tr key={type.id}>
                {editingId === type.id ? (
                  <>
                    <td className="value-blue col-type">
                      <input
                        type="text"
                        name="type"
                        value={formState.type}
                        onChange={handleEditChange}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="value-gray col-valid-since">
                      <input
                        type="date"
                        name="valid_since"
                        value={formState.valid_since}
                        onChange={handleEditChange}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="value-gray col-valid-till">
                      <input
                        type="date"
                        name="valid_till"
                        value={formState.valid_till}
                        onChange={handleEditChange}
                        className="input-field table-input"
                      />
                    </td>
                    <td className="value-gray col-restrictions">
                      <input
                        type="text"
                        name="restrictions"
                        value={formState.restrictions}
                        onChange={handleEditChange}
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
                      {type.valid_since
                        ? new Date(type.valid_since).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="value-gray col-valid-till">
                      {type.valid_till
                        ? new Date(type.valid_till).toLocaleDateString()
                        : ""}
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
            ))}
            {adding && (
              <tr className="add-license-row">
                <td className="value-blue col-type">
                  <input
                    type="text"
                    name="type"
                    placeholder="Type"
                    value={newLicenseType.type}
                    onChange={handleAddChange}
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
  );
};

export default DrivingLicenseBack;
