// src/components/AddUserForm.tsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { RegisterUser } from "../../types/RegisterUser";
import { ButtonComponent } from "../ButtonComponent";
import { ButtonHTMLType, ButtonType } from "../../enums/ButtonType";
import { User } from "../../types/User";
import { getErrorMessage } from "../../utils/errorHandler";

interface AddUserFormProps {
  onAdd: (user: User) => void; // Zmień na odpowiedni typ jeśli potrzebujesz
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAdd }) => {
  const [username, setUsername] = useState<string>("");
  const [workerId, setWorkerId] = useState<number>(0);
  const [password, setPassword] = useState<string>("");
  const [roles, setRoles] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pobieranie dostępnych ról (jeśli masz endpoint na dostępne role)
  useEffect(() => {
    const fetchAvailableRoles = async () => {
      try {
        const response = await api.get<string[]>("/roles"); // Zakładam, że taki endpoint istnieje
        setAvailableRoles(response.data);
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        console.log(errorMessage);
      }
    };
    fetchAvailableRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const newUser: RegisterUser = {
      username,
      worker_id: workerId,
      password,
      roles,
    };

    try {
      const response = await api.post("/register", newUser);
      onAdd(response.data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      console.log(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Wprowadź username"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Worker ID</label>
        <input
          type="number"
          value={workerId}
          onChange={(e) => setWorkerId(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
          placeholder="Wprowadź Worker ID"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Wprowadź hasło"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Roles</label>
        <select
          multiple
          value={roles}
          onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions).map(
              (option) => option.value
            );
            setRoles(selectedOptions);
          }}
          className="w-full px-3 py-2 border rounded bg-white"
          required
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-4">
        <ButtonComponent
          label={isSubmitting ? "Dodawanie..." : "Dodaj"}
          type={ButtonType.Success}
          buttonType={ButtonHTMLType.Submit}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default AddUserForm;
