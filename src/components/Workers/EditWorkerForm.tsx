// src/components/EditWorkerForm.tsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { getErrorMessage } from "../../utils/errorHandler";
import { ButtonHTMLType, ButtonType } from "../../enums/ButtonType";
import { Worker } from "../../types/Worker";
import { Department } from "../../types/Department";
import { ButtonComponent } from "../ButtonComponent";

interface EditWorkerFormProps {
  worker: Worker;
  onEdit: (worker: Worker) => void;
}

const EditWorkerForm: React.FC<EditWorkerFormProps> = ({ worker, onEdit }) => {
  const [firstName, setFirstName] = useState<string>(worker.first_name);
  const [lastName, setLastName] = useState<string>(worker.last_name);
  const [middleName, setMiddleName] = useState<string>(worker.middle_name || "");
  const [birthday, setBirthday] = useState<string>(worker.birthday);
  const [departmentId, setDepartmentId] = useState<number | "">(worker.department_id || "");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [errorDepartments, setErrorDepartments] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    setIsSubmitting(true);
    try {
      const updatedWorker = {
        ...worker,
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        birthday,
        department_id: departmentId, // Używamy department_id zamiast department
      };
      const response = await api.put<Worker>(`/worker/${worker.id}`, updatedWorker);
      onEdit(response.data); // Przekazanie zaktualizowanego pracownika do rodzica
      setError("");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        ) : departments.length === 0 ? (
          <p>Brak dostępnych działów.</p>
        ) : (
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded bg-white"
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
          label={isSubmitting ? "Zapisywanie..." : "Zapisz"}
          type={ButtonType.Success}
          buttonType={ButtonHTMLType.Submit}
          disabled={isSubmitting || loadingDepartments || departments.length === 0}
        />

      </div>
    </form>
  );
};

export default EditWorkerForm;
