// src/components/AddUserForm.tsx
import React, { useState } from "react";
import { useRoles } from "../../hooks/useRoles"; // Import the useRoles hook
import { useNotAssignedWorkers } from "../../hooks/useNotAssignedWorkers"; // Import the custom hook
import api from "../../api/axiosConfig";
import { RegisterUser } from "../../types/RegisterUser";
import { ButtonComponent } from "../ButtonComponent";
import { ButtonHTMLType, ButtonType } from "../../enums/ButtonType";
import { User } from "../../types/User";
import { getErrorMessage } from "../../utils/errorHandler";
import Select, { SingleValue } from "react-select";

interface WorkerOption {
  value: number;
  label: string;
}

interface RoleOption {
  value: number;
  label: string;
}

interface AddUserFormProps {
  onAdd: (user: User) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onAdd }) => {
  const [username, setUsername] = useState<string>("");
  const [selectedWorker, setSelectedWorker] = useState<WorkerOption | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Use the useRoles hook
  const { roles: availableRoles, loading: rolesLoading, error: rolesError } = useRoles();

  // Use the useNotAssignedWorkers hook without currentWorkerId
  const { workers, loading: workersLoading, error: workersError } = useNotAssignedWorkers();

  // Convert workers to options for react-select
  const workerOptions: WorkerOption[] = workers.map((worker) => ({
    value: worker.id,
    label: `${worker.last_name} ${worker.first_name}`,
  }));

  // Convert roles to options for react-select
  const roleOptions: RoleOption[] = availableRoles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate inputs
    if (username.trim() === "") {
      setError("Username is required.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedWorker) {
      setError("Please select a worker.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedRole) {
      setError("Please select a role.");
      setIsSubmitting(false);
      return;
    }

    const newUser: RegisterUser = {
      username,
      worker_id: selectedWorker.value,
      role_id: selectedRole.value,
    };

    try {
      const response = await api.post<User>("/users", newUser);
      onAdd(response.data);
      // Optionally reset the form
      setUsername("");
      setSelectedWorker(null);
      setSelectedRole(null);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      console.log(errorMessage);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">Add New User</h2>

      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}

      {/* Username Field */}
      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter username"
          required
        />
      </div>

      {/* Worker Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">Worker</label>
        {workersLoading ? (
          <p className="text-gray-500">Loading workers...</p>
        ) : workersError ? (
          <p className="text-red-500 text-sm">Error loading workers: {workersError}</p>
        ) : workers.length === 0 ? (
          <p className="text-gray-500">No workers available.</p>
        ) : (
          <Select
            options={workerOptions}
            value={selectedWorker}
            onChange={(option: SingleValue<WorkerOption>) => setSelectedWorker(option)}
            isClearable
            placeholder="Select Worker"
            className="w-full"
          />
        )}
      </div>

      {/* Role Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">Role</label>
        {rolesLoading ? (
          <p className="text-gray-500">Loading roles...</p>
        ) : rolesError ? (
          <p className="text-red-500 text-sm">Error loading roles: {rolesError}</p>
        ) : availableRoles.length === 0 ? (
          <p className="text-gray-500">No roles available.</p>
        ) : (
          <Select
            options={roleOptions}
            value={selectedRole}
            onChange={(option: SingleValue<RoleOption>) => setSelectedRole(option)}
            isClearable
            placeholder="Select Role"
            className="w-full"
          />
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <ButtonComponent
          label={isSubmitting ? "Adding..." : "Add User"}
          type={ButtonType.Success}
          buttonType={ButtonHTMLType.Submit}
          disabled={
            isSubmitting ||
            workersLoading ||
            rolesLoading ||
            !!workersError ||
            !!rolesError
          }
        />
      </div>
    </form>
  );
};

export default AddUserForm;
