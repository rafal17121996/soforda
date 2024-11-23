import React, { useState, useEffect } from "react";
import { DriverCard } from "../../../../../types/Worker";
import { ButtonComponent } from "../../../../ButtonComponent";
import { ButtonType } from "../../../../../enums/ButtonType";
import {
  ActiveIndicator,
  DeleteIcon,
  UserSquareIcon,
} from "../../../../../icons/icons";
import api from "../../../../../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../../../../utils/handleAxiosError";
import ConfirmationModal from "../../../../ConfirmationModal";
import "flag-icons/css/flag-icons.min.css";

interface DriverCardFrontProps {
  driverCard: DriverCard;
}

const DriverCardFront: React.FC<DriverCardFrontProps> = ({ driverCard }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  // const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<DriverCard | null>(null);

  useEffect(() => {
    if (driverCard) {
      setFormState({ ...driverCard });
    }
  }, [driverCard]);

  // const handlePrevCard = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setCurrentCardIndex((prevIndex) =>
  //     prevIndex > 0 ? prevIndex - 1 : driverCard.length - 1
  //   );
  //   setIsEditing(false);
  //   setIsDeleteModalOpen(false);
  // };

  // const handleNextCard = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   setCurrentCardIndex((prevIndex) =>
  //     prevIndex < driverCards.length - 1 ? prevIndex + 1 : 0
  //   );
  //   setIsEditing(false);
  //   setIsDeleteModalOpen(false);
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formState) return;
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev!, [name]: value }));
  };

  const handleSave = async () => {
    if (!formState) return;
    try {
      const payload = {
        card_number: formState.card_number,
        issuing_authority: formState.issuing_authority,
        driving_license_number: formState.driving_license_number,
        date_issued: formState.date_issued,
        valid_until: formState.valid_until,
      };

      await api.put<DriverCard>(`/driver_cards/${formState.id}`, payload);
      toast.success("Driver card updated successfully.");
      setIsEditing(false);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (driverCard) {
      setFormState({ ...driverCard });
    }
  };

  const handleCardModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen((prev) => !prev);
  };

  const handleDeleteCard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!formState) return;
    try {
      await api.delete(`/driver_cards/${formState.id}`);
      toast.success("Driver card deleted successfully.");
      setIsDeleteModalOpen(false);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleToggleActive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!formState) return;
    try {
      const updatedActive = !formState.active;
      const payload = { active: updatedActive };
      await api.put<DriverCard>(`/driver_cards/${formState.id}`, payload);
      toast.success(
        `Driver card ${
          updatedActive ? "activated" : "deactivated"
        } successfully.`
      );
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  if (!driverCard) {
    return <div>Brak kart kierowcy.</div>;
  }

  return (
    <div
      className="license-container"
      onClick={(e) => e.stopPropagation()}
      style={{ position: "relative" }}
    >
      <div className="driver-card-front">
        <div className="flag-section">
          <span className="fi fi-eu"></span>
          <div className="country-section">
            <span className="country-label">KARTA KIEROWCY&nbsp;</span>
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
              aria-label="Edit Driver Card"
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
              <span className="value">{driverCard.last_name}</span>
            </div>
            <div className="info-row">
              <span className="value-blue">2.</span>
              <span className="value-gray">
                {driverCard.first_name} {driverCard.middle_name}
              </span>
            </div>
            <div className="info-row">
              <span className="value-blue">3.</span>
              <span className="value">
                {driverCard.birthday
                  ? new Date(driverCard.birthday).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <div className="info-row">
              <span className="value-blue">4a.</span>
              {isEditing ? (
                <input
                  type="date"
                  name="dateIssued"
                  value={formState?.date_issued || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <span className="value-gray">
                  {driverCard.date_issued
                    ? new Date(driverCard.date_issued).toLocaleDateString()
                    : ""}
                </span>
              )}
              <span className="value-blue">4b.</span>
              {isEditing ? (
                <input
                  type="text"
                  name="placeOfIssue"
                  value={formState?.valid_until || ""}
                  onChange={handleChange}
                  className="input-field"
                />
              ) : (
                <span className="value-gray">
                  {driverCard.valid_until
                    ? new Date(driverCard.valid_until).toLocaleDateString()
                    : ""}
                </span>
              )}
            </div>
            <div className="info-row">
              <span className="value-blue">4c.</span>
              {isEditing ? (
                <input
                  type="date"
                  name="valid_until"
                  value={formState?.issuing_authority || ""}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Valid Until"
                />
              ) : (
                <span className="value-gray">
                  {driverCard.issuing_authority}
                </span>
              )}
            </div>
            <div className="info-row">
              <span className="value-blue">5a.</span>
              {isEditing ? (
                <input
                  type="text"
                  name="number"
                  value={formState?.driving_license_number || ""}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="number"
                />
              ) : (
                <span className="value">{driverCard.driving_license_number}</span>
              )}
            </div>
            <div className="info-row">
            <span className="value-blue">5b.</span>
            {isEditing ? (
              <input
                type="text"
                name="number"
                value={formState?.card_number || ""}
                onChange={handleChange}
                className="input-field"
                placeholder="number"
              />
            ) : (
              <span className="value">{driverCard.card_number}</span>
            )}
          </div>
          </div>
        </div>
        <ActiveIndicator
          active={driverCard.active}
          onClick={handleToggleActive}
        />
        <button
          className="delete-license-button"
          onClick={handleCardModal}
          aria-label="Delete Driver Card"
          title="Delete Driver Card"
        >
          <DeleteIcon />
        </button>
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Potwierdź Usunięcie"
          message="Czy na pewno chcesz usunąć tę kartę kierowcy? Ta akcja jest nieodwracalna."
          onConfirm={handleDeleteCard}
          onCancel={handleCardModal}
          cancel={true}
        />
        {/* {driverCards.length > 1 && (
          <div className="navigation-buttons flex justify-center">
            <button
              className="prev-card-button"
              onClick={handlePrevCard}
              aria-label="Previous Driver Card"
              title="Previous Driver Card"
            >
              &lt;
            </button>
            <p>{currentCardIndex}</p>
            <button
              className="next-card-button"
              onClick={handleNextCard}
              aria-label="Next Driver Card"
              title="Next Driver Card"
            >
              &gt;
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default DriverCardFront;
