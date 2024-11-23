import React, { useState, useEffect } from "react";
import { DrivingLicense as DrivingLicenseType } from "../../../../../types/Worker";
import { ButtonComponent } from "../../../../ButtonComponent";
import { ButtonType } from "../../../../../enums/ButtonType";
import { ActiveIndicator, DeleteIcon, UserSquareIcon } from "../../../../../icons/icons";
import api from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import "flag-icons/css/flag-icons.min.css";
import ConfirmationModal from "../../../../ConfirmationModal";

interface DrivingLicenseFrontProps {
  license: DrivingLicenseType;
  onUpdate?: () => void;
  setIsEditing: (value:boolean) => void;
  isEditing : boolean;
}

const DrivingLicenseFront: React.FC<DrivingLicenseFrontProps> = ({ license, onUpdate, setIsEditing, isEditing }) => {

  const[isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [formState, setFormState] = useState({
    country: license.country || "",
    number: license.number || "",
    dateIssued: license.date_issued || "",
    validUntil: license.valid_until || "",
    placeOfBirth: license.place_of_birth || "",
    placeOfIssue: license.place_of_issue || "",
  });

  useEffect(() => {
    setFormState({
      country: license.country || "",
      number: license.number || "",
      dateIssued: license.date_issued || "",
      validUntil: license.valid_until || "",
      placeOfBirth: license.place_of_birth || "",
      placeOfIssue: license.place_of_issue || "",
    });
  }, [license]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        country: formState.country,
        number: formState.number,
        date_issued: formState.dateIssued,
        valid_until: formState.validUntil,
        place_of_birth: formState.placeOfBirth,
        place_of_issue: formState.placeOfIssue,
      };

      await api.put<DrivingLicenseType>(`/driving_licenses/${license.id}`, payload);
      toast.success("Driving license updated successfully.");
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormState({
      country: license.country || "",
      number: license.number || "",
      dateIssued: license.date_issued || "",
      validUntil: license.valid_until || "",
      placeOfBirth: license.place_of_birth || "",
      placeOfIssue: license.place_of_issue || "",
    });
  };

  const handleLicenseModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(prev => !prev)
  }

  const handleDeleteLicense = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/driving_licenses/${license.id}`);
      toast.success("Driving license deleted successfully.");
      if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updatedActive = !license.active;
      const payload = { active: updatedActive };
      await api.put<DrivingLicenseType>(`/driving_licenses/${license.id}`, payload);
      toast.success(`Driving license ${updatedActive ? "activated" : "deactivated"} successfully.`);
      if (onUpdate) onUpdate();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="license-front">
      <div className="flag-section">
        <span className="fi fi-eu"></span>
        <div className="country-section">
          <span className="country-label">PRAWO JAZDY&nbsp;</span>
          {isEditing ? (
            <input
              type="text"
              name="country"
              value={formState.country.toUpperCase()}
              onChange={handleChange}
              className="input-field-country"
            />
          ) : (
            <span className="country-value">{formState.country.toUpperCase()}</span>
          )}
        </div>
        {!isEditing && (
          <ButtonComponent
            label="Edit Driving License"
            type={ButtonType.Icon}
            className="edit-button table-button"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            aria-label="Edit Driving License"
          />
        )}
        {isEditing && (
          <div className="front-edit-actions ml-[10px] flex">
            <ButtonComponent
              label="Save"
              type={ButtonType.Icon}
              className="save-button table-button"
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
            />
            <ButtonComponent
              label="Cancel"
              type={ButtonType.Icon}
              className="cancel-button table-button"
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
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
            <span className="value">{license.last_name}</span>
          </div>
          <div className="info-row">
            <span className="value-blue">2.</span>
            <span className="value-gray">
              {license.first_name} {license.middle_name}
            </span>
          </div>
          <div className="info-row">
            <span className="value-blue">3.</span>
            <span className="value">
              <span className="date-birthday">
                {license.birthday ? new Date(license.birthday).toLocaleDateString() : ""}
              </span>
              <span className="place-of-birth">
                {isEditing ? (
                  <input
                    type="text"
                    name="placeOfBirth"
                    value={formState.placeOfBirth}
                    onChange={handleChange}
                    className="input-field"
                  />
                ) : (
                  <span className="value-gray">{formState.placeOfBirth}</span>
                )}
              </span>
            </span>
          </div>
          <div className="info-row">
            <span className="value-blue">4a.</span>
            {isEditing ? (
              <input
                type="date"
                name="dateIssued"
                value={formState.dateIssued}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="value-gray">
                {license.date_issued ? new Date(license.date_issued).toLocaleDateString() : ""}
              </span>
            )}
            <span className="value-blue">4c.</span>
            {isEditing ? (
              <input
                type="text"
                name="placeOfIssue"
                value={formState.placeOfIssue}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="value-gray">{formState.placeOfIssue}</span>
            )}
          </div>
          <div className="info-row">
            <span className="value-blue">4b.</span>
            {isEditing ? (
              <input
                type="date"
                name="validUntil"
                value={formState.validUntil}
                onChange={handleChange}
                className="input-field"
              />
            ) : (
              <span className="value-gray">
                {license.valid_until ? new Date(license.valid_until).toLocaleDateString() : ""}
              </span>
            )}
          </div>
          <div className="info-row">
            <span className="value-blue">5.</span>
            {isEditing ? (
              <input
                type="text"
                name="number"
                value={formState.number}
                onChange={handleChange}
                className="input-field"
                placeholder="number"
              />
            ) : (
              <span className="value">{formState.number}</span>
            )}
          </div>
        </div>
      </div>
      <div className="bottom-section">
        <span className="value-blue">9.</span>
        <span className="value-gray">
          {license.license_types
            .slice()
            .sort((a, b) => a.type.localeCompare(b.type))
            .map((lt) => lt.type)
            .join("/")}
        </span>
      </div>
      <ActiveIndicator active={license.active} onClick={handleToggleActive} />
      <button
        className="delete-license-button"
        onClick={handleLicenseModal}
        aria-label="Delete Driving License"
        title="Delete Driving License"
      >
        <DeleteIcon />
      </button>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Potwierdź Usunięcie"
        message="Czy na pewno chcesz usunąć to uprawnienie? Ta akcja jest nieodwracalna."
        onConfirm={handleDeleteLicense}
        onCancel={handleLicenseModal}
        cancel={true}
      />
    </div>
  );
};

export default DrivingLicenseFront;
