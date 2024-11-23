// src/components/DrivingLicense/DrivingLicenseBack.tsx

import React from "react";
import { LicenseType } from "../../../../../types/Worker";
import { ButtonType } from "../../../../../enums/ButtonType";
import { ButtonComponent } from "../../../../ButtonComponent"; 
import { 
  AddLicenseTypeIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  DeleteIcon 
} from "../../../../../icons/icons";
import LicenseTypeRow from "./LicenseTypeRow";
import Pagination from "../../../../Pagination";

interface DrivingLicenseBackProps {
  sortedLicenseTypes: LicenseType[];
  sortOrder: "asc" | "desc";
  toggleSortOrder: () => void;
  currentRows: LicenseType[];
  handleEdit: (type: LicenseType) => void;
  handleDelete: (id: number) => void;
  adding: boolean;
  setAdding: React.Dispatch<React.SetStateAction<boolean>>;
  newLicenseType: LicenseType;
  handleAddChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAddLicenseType: () => void;
  currentPage: number;
  totalPages: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  handlePageSelect: (page: number) => void;
}

const DrivingLicenseBack: React.FC<DrivingLicenseBackProps> = ({
  sortedLicenseTypes,
  sortOrder,
  toggleSortOrder,
  currentRows,
  handleEdit,
  handleDelete,
  adding,
  setAdding,
  newLicenseType,
  handleAddChange,
  handleAddLicenseType,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  handlePageSelect,
}) => {
  const rowsPerPage = 5; // Ensure this matches the main component

  return (
    <div className="license-back">
      <div className="info-section">
        <table className="license-table">
          <thead>
            <tr>
              <th
                className="value-blue-table col-type"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSortOrder();
                }}
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
                      if (currentRows.length >= rowsPerPage) {
                        const targetPage = Math.ceil(
                          (sortedLicenseTypes.length + 1) / rowsPerPage
                        );
                        handlePageSelect(targetPage);
                        setAdding(true);
                      } else {
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
            {currentRows.map((type) => (
              <LicenseTypeRow
                key={type.id}
                type={type}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
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
                        // Assuming setIsEditing is handled in the main component if needed
                      }}
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
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

export default DrivingLicenseBack;
