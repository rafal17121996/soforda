// src/components/EditWorkerForm.tsx
import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { getErrorMessage } from "../../utils/errorHandler";
import { Worker } from "../../types/Worker";
import { Department } from "../../types/Department";
import { handleAxiosError } from "../../utils/handleAxiosError";
import { toast } from "react-toastify";

interface EditWorkerFormProps {
  worker: Worker;
  onEdit: (worker: Worker) => void;
  onClose: () => void;
}

const EditWorkerForm: React.FC<EditWorkerFormProps> = ({
  worker,
  onEdit,
  onClose,
}) => {
  const [firstName, setFirstName] = useState<string>(worker.first_name);
  const [lastName, setLastName] = useState<string>(worker.last_name);
  const [middleName, setMiddleName] = useState<string>(
    worker.middle_name || ""
  );
  const [birthday, setBirthday] = useState<string>(worker.birthday);
  const [departmentId, setDepartmentId] = useState<number | "">(
    worker.department_id || ""
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState<boolean>(true);
  const [errorDepartments, setErrorDepartments] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoadingDepartments(true);
        const response = await api.get<{items: Department[]}>("/departments");
        setDepartments(response.data.items);
        setErrorDepartments("");
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err);
        setErrorDepartments(errorMessage);
        handleAxiosError(err);
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
      toast.error("Proszę wybrać dział.");
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
      const response = await api.put<Worker>(
        `/workers/${worker.id}`,
        updatedWorker
      );
      onEdit(response.data); // Przekazanie zaktualizowanego pracownika do rodzica
      setError("");
      toast.success("Pomyślnie zaktualizowano pracownika.");
      onClose();
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      handleAxiosError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-1 text-sm text-red-600 text-center">{error}</div>
      )}
      {errorDepartments && (
        <div className="mb-1 text-sm text-red-600 text-center">
          {errorDepartments}
        </div>
      )}
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <label className="block mb-1 text-sm text-slate-700">Imię</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          placeholder="Wprowadź imię"
          required
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <label className="block mb-1 text-sm text-slate-700">Drugie Imię</label>
        <input
          type="text"
          value={middleName}
          onChange={(e) => setMiddleName(e.target.value)}
          className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          placeholder="Wprowadź drugie imię (opcjonalne)"
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <label className="block mb-1 text-sm text-slate-700">Nazwisko</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          placeholder="Wprowadź nazwisko"
          required
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <label className="block mb-1 text-sm text-slate-700">
          Data Urodzenia
        </label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
          required
        />
      </div>
      <div className="w-full max-w-sm min-w-[200px] mt-4">
        <label className="block mb-1 text-sm text-slate-700">Dział</label>
        {loadingDepartments ? (
          <p>Ładowanie działów...</p>
        ) : departments.length === 0 ? (
          <p>Brak dostępnych działów.</p>
        ) : (
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(Number(e.target.value))}
            className="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
            required
          >
            <option value="">Wybierz Dział</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="mt-8 p-6 pt-0">
        <div className="flex space-x-2">
          <button
            className="w-full mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="button"
            data-dialog-close="true"
            onClick={onClose}
          >
            Zamknij
          </button>
          <button
            className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            type="submit"
            data-dialog-close="true"
            disabled={
              isSubmitting || loadingDepartments || departments.length === 0
            }
          >
            {isSubmitting ? "Zapisywanie..." : "Zapisz"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditWorkerForm;
