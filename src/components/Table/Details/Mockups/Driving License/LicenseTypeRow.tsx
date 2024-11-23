// src/components/DrivingLicense/LicenseTypeRow.tsx

import React, { useState } from "react";
import { LicenseType } from "../../../../../types/Worker";
import { ButtonType } from "../../../../../enums/ButtonType";
import { ButtonComponent } from "../../../../ButtonComponent"; 

interface LicenseTypeRowProps {
  type: LicenseType;
  handleEdit: (type: LicenseType) => void;
  handleDelete: (id: number) => void;
}

const LicenseTypeRow: React.FC<LicenseTypeRowProps> = ({
  type,
  handleEdit,
  handleDelete,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formState, setFormState] = useState<LicenseType>({ ...type });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    handleEdit(formState);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormState({ ...type });
    setIsEditing(false);
  };

  return (
    <tr key={type.id}>
      {isEditing ? (
        <>
          <td className="value-blue col-type">
            <input
              type="text"
              name="type"
              value={formState.type}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
                label="Edit License Type"
                type={ButtonType.Icon}
                className="edit-button table-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              />
              <ButtonComponent
                label="Delete License Type"
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
};

export default LicenseTypeRow;
