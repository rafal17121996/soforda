// src/components/AddWorkerForm.tsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { getErrorMessage } from "../../utils/errorHandler";
import { ButtonHTMLType, ButtonType } from "../../enums/ButtonType";
import { Worker } from "../../types/Worker";
import { Department } from "../../types/Department";
import { ButtonComponent } from "../ButtonComponent";

interface AddWorkerFormProps {
  onAdd: (worker: Worker) => void;
}

export const AddWorkerForm: React.FC<AddWorkerFormProps> = ({ onAdd }) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [middleName, setMiddleName] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<number | "">(""); // Zmieniamy na number lub pusty string
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [errorDepartments, setErrorDepartments] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const response = await api.get<Department[]>("/department");
        setDepartments(response.data);
        setErrorDepartments("");
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setErrorDepartments(errorMessage);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Walidacja wybranego działu
    if (departmentId === "") {
      setError("Proszę wybrać dział.");
      return;
    }

    try {
      const newWorker = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        birthday,
        department_id: departmentId, 
      };
      const response = await api.post<Worker>("/worker", newWorker);
      onAdd(response.data);
      // Resetujemy formularz po dodaniu
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setBirthday("");
      setDepartmentId("");
      setError("");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
      {errorDepartments && (
        <div className="mb-4 text-red-500 text-sm text-center">
          {errorDepartments}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700">Imię</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Wprowadź imię"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Drugie Imię</label>
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Wprowadź drugie imię (opcjonalne)"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Nazwisko</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Wprowadź nazwisko"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Data Urodzenia</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Dział</label>
        {loadingDepartments ? (
          <p>Ładowanie działów...</p>
        ) : (
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">-- Wybierz Dział --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="flex justify-end space-x-4">
        <ButtonComponent
          label="Zapisz"
          type={ButtonType.Success}
          buttonType={ButtonHTMLType.Submit}
          disabled={loadingDepartments || departments.length === 0}
        />
      </div>
    </form>
  );
};