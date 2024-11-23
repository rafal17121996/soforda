// src/components/DrivingLicense/DrivingLicenseFront.tsx

import React from "react";
import { ButtonType } from "../../../../../enums/ButtonType";
import { ButtonComponent } from "../../../../ButtonComponent"; 
import { ActiveIndicator, DeleteIcon, UserSquareIcon } from "../../../../../icons/icons";
import { DrivingLicense as DrivingLicenseType } from "../../../../../types/Worker";

interface DrivingLicenseFrontProps {
  licenseData: DrivingLicenseType;
  isEditingFront: boolean;
  handleFrontChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setIsEditingFront: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveFrontEdit: () => void;
  handleCancelFrontEdit: () => void;
  handleToggleActive: () => void;
  handleDeleteLicense: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const DrivingLicenseFront: React.FC<DrivingLicenseFrontProps> = ({
  licenseData,
  isEditingFront,
  handleFrontChange,
  setIsEditingFront,
  handleSaveFrontEdit,
  handleCancelFrontEdit,
  handleToggleActive,
  handleDeleteLicense,
}) => {
  return (
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
              // Assuming setIsEditing is passed down if needed
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
                    value={licenseData.place_of_birth}
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
                value={licenseData.date_issued}
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
                value={licenseData.place_of_issue}
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
                value={licenseData.valid_until}
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
                value={licenseData.number}
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
            .slice()
            .sort((a, b) => a.type.localeCompare(b.type))
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
        onClick={handleDeleteLicense}
        aria-label="Delete Driving License"
        title="Delete Driving License"
      >
        <DeleteIcon />
      </button>
    </div>
  );
};

export default DrivingLicenseFront;
