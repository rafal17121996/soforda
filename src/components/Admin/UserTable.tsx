// src/components/UserTable.tsx
import React, { useState, useEffect } from "react";
import { User } from "../../types/User";
import Pagination from "../Pagination";
import { PaginationData } from "../../types/PaginationData";
import { ButtonComponent } from "../ButtonComponent";
import { ButtonType } from "../../enums/ButtonType";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../utils/handleAxiosError";
import ConfirmationModal from "../ConfirmationModal";
import { useNotAssignedWorkers } from "../../hooks/useNotAssignedWorkers"; // Import the custom hook
import { useRoles } from "../../hooks/useRoles"; // Import the roles hook
import Select, { SingleValue, StylesConfig } from "react-select"; // Import react-select
import { Skeleton } from "@mui/material";


const customSelectStyles: StylesConfig<WorkerOption | RoleOption, false> = {
  control: (base) => ({
    ...base,
    minHeight: '30px',
    height: '30px',
    fontSize: '12px',
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: '30px',
  }),
  valueContainer: (base) => ({
    ...base,
    height: '30px',
    padding: '0 6px',
  }),
  input: (base) => ({
    ...base,
    margin: '0px',
    padding: '0px',
    fontSize: '12px',
  }),
  placeholder: (base) => ({
    ...base,
    fontSize: '12px',
  }),
  menu: (base) => ({
    ...base,
    fontSize: '12px',
    zIndex: 9999,
  }),
  menuList: (base) => ({
    ...base,
    padding: '0px',
    maxHeight: '150px',
  }),
  option: (base, state) => ({
    ...base,
    padding: '6px 12px',
    fontSize: '12px',
    backgroundColor: state.isFocused ? '#f0f0f0' : 'white',
    color: 'black',
  }),
};
interface WorkerOption {
  value: number;
  label: string;
}

interface RoleOption {
  value: number;
  label: string;
}

interface UserTableProps {
  users: User[];
  error: string;
  loading: boolean;
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
  editMode?: boolean;
  onUserUpdated?: () => void; // Callback to refresh users after update
  withTempPass?: boolean;
}

const SkeletonRow = ({ columns }: { columns: number }) => (
  <tr className="border-b border-gray-200">
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="py-3 px-6 text-center">
        <Skeleton variant="rectangular" width="100%" height={20} />
      </td>
    ))}
  </tr>
);

const UserTable: React.FC<UserTableProps> = ({
  users,
  error,
  loading,
  paginationData,
  onPageChange,
  editMode = false,
  onUserUpdated,
  withTempPass = false,
}) => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUserUsername, setEditingUserUsername] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);

  // State for Confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenPass, setIsModalOpenPass] = useState<boolean>(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string>("");
  const [userToDelete, setUserToDelete] = useState<number | null>(null); 

  // State for Workers and Roles
  const [currentWorkerId, setCurrentWorkerId] = useState<number | undefined>(undefined);

  // Fetch assigned workers using the custom hook, include current worker if editing
  const { workers, loading: workersLoading, error: workersError } = useNotAssignedWorkers(currentWorkerId);

  // Fetch roles using the custom hook
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();

  // Effect to reset worker ID when not editing
  useEffect(() => {
    if (editingUserId === null) {
      setCurrentWorkerId(undefined);
    }
  }, [editingUserId]);

  if (loading) {
    return (
      <div className="overflow-x-auto px-5 pb-5">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-center">ID</th>
              <th className="py-3 px-6 text-center">Username</th>
              <th className="py-3 px-6 text-center">Temporary Password</th>
              {withTempPass || <th className="py-3 px-6 text-center">First Name</th>}
              {withTempPass || <th className="py-3 px-6 text-center">Last Name</th>}
              {withTempPass || <th className="py-3 px-6 text-center">Role</th>}
              {withTempPass || <th className="py-3 px-6 text-center">Department</th>}
              {editMode && <th className="py-3 px-6 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index} columns={editMode ? 8 : 7} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (workersError) {
    return <p className="text-red-500">Error loading workers: {workersError}</p>;
  }

  if (rolesError) {
    return <p className="text-red-500">Error loading roles: {rolesError}</p>;
  }

  // Convert workers to options for react-select
  const workerOptions: WorkerOption[] = workers.map((worker) => ({
    value: worker.id,
    label: `${worker.last_name} ${worker.first_name}`,
  }));

  // Convert roles to options for react-select
  const roleOptions: RoleOption[] = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }));

  // Handlers for the action buttons
  const handleEdit = (user: User) => {
    // Enable inline editing for the selected user
    setEditingUserId(user.id);
    setEditingUserUsername(user.username);
    setEditFormData({ ...user });
    setCurrentWorkerId(user.worker_id); // Include current worker's ID
  };

  const handleEditChangeWorker = (selectedOption: SingleValue<WorkerOption>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        worker_id: selectedOption ? selectedOption.value : 0,
      });
    }
  };

  const handleEditChangeRole = (selectedOption: SingleValue<RoleOption>) => {
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        role_id: selectedOption ? selectedOption.value : 0,
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editFormData) {
      const { name, value } = e.target;
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleEditSubmit = async () => {
    if (editingUserId === null || !editFormData) return;

    try {
      await api.put(`/users/${editingUserId}`, {
        username: editFormData.username,
        role_id: editFormData.role_id,
        worker_id: editFormData.worker_id,
      });
      toast.success(`User with ID ${editingUserId}. ${editingUserUsername} updated successfully.`);
      setEditingUserId(null);
      setEditFormData(null);
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingUserUsername(null);
    setEditFormData(null);
  };

  const handleDelete = async () => {
    if (userToDelete === null) return;

    const user = users.find((u) => u.id === userToDelete);
    const userName = user ? user.username : "Unknown User";


    try {
      await api.delete(`/users/${userToDelete}`);
      toast.success(`User with ID ${userToDelete}. ${userName} deleted successfully.`);
      setUserToDelete(null);
      setIsModalOpen(false);
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const handleTempPass = async (userId: number) => {
    try {
      const res = await api.patch(`/temporary_password/${userId}`);
      console.log(res.data);
      console.log(res.data.data.temporary_password);
      setIsModalOpenPass(true);
      setTemporaryPassword(res.data.data.temporary_password);
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  // Handler to open the confirmation modal
  const confirmDelete = (userId: number) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  // Handler to close the confirmation modal without deleting
  const cancelDelete = () => {
    setUserToDelete(null);
    setIsModalOpen(false);
    setIsModalOpenPass(false);
  };

  return (
    <div className="overflow-x-auto px-5 pb-5">
      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        cancel={true}
      />

      {/* Confirmation Modal for Temporary Password */}
      <ConfirmationModal
        isOpen={isModalOpenPass}
        title="Temporary Password"
        message={`Your temporary password is: ${temporaryPassword}`}
        onConfirm={() => setIsModalOpenPass(false)}
        onCancel={() => setIsModalOpenPass(false)}
        cancel={false} // Assuming no cancel button for this modal
      />

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
          <th className="py-3 px-6 text-center">ID</th>
              <th className="py-3 px-6 text-center">Username</th>
              {withTempPass ||<th className="py-3 px-6 text-center">Worker ID</th>}
              {withTempPass || <th className="py-3 px-6 text-center">First Name</th>}
              {withTempPass || <th className="py-3 px-6 text-center">Last Name</th>}
              <th className="py-3 px-6 text-center">Role</th>
              {withTempPass || <th className="py-3 px-6 text-center">Department</th>}
            {editMode && (
              <th className="py-3 px-6 text-center">
                <div className="flex items-center gap-5 justify-center">
                  <span>Actions</span>
            
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.length === 0 ? (
            <tr>
              <td colSpan={editMode ? 8 : 7} className="py-3 px-6 text-center">
                No users to display.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                {editingUserId === user.id && editFormData ? (
                  <>
                    <td className="py-3 px-6 text-center">{user.id}</td>

                    {/* Username Input */}
                    <td className="py-3 px-6 text-center">
                      <input
                        type="text"
                        name="username"
                        value={editFormData.username || ""}
                        onChange={handleInputChange}
                        className="border px-2 py-1 rounded w-full text-center"
                      />
                    </td>

                    {/* Worker Dropdown */}
                    <td className="py-3 px-6 text-center">
                    <Select
                      options={workerOptions}
                      value={
                        workerOptions.find(
                          (option) => option.value === editFormData.worker_id
                        ) || null
                      }
                      onChange={handleEditChangeWorker}
                      isLoading={workersLoading}
                      isClearable
                      placeholder="Select Worker"
                      className="w-full"
                      menuPortalTarget={document.body}
                      styles={customSelectStyles}
                    />
                    </td>

                    {/* First Name */}
                    {withTempPass || <td className="py-3 px-6 text-center">{user.first_name}</td>}

                    {/* Last Name */}
                    {withTempPass || <td className="py-3 px-6 text-center">{user.last_name}</td>}

                    {/* Role Dropdown */}
                    {withTempPass || <td className="py-3 px-6 text-center">
                    <Select
                      options={roleOptions}
                      value={
                        roleOptions.find(
                          (option) => option.value === editFormData.role_id
                        ) || null
                      }
                      onChange={handleEditChangeRole}
                      isLoading={rolesLoading}
                      isClearable
                      placeholder="Select Role"
                      className="w-full"
                      menuPortalTarget={document.body}
                      styles={customSelectStyles}
                    />
                    </td>}

                    {/* Department Name */}
                    {withTempPass || <td className="py-3 px-6 text-center">
                      {user.department_name}
                    </td>}

                    {/* Action Buttons */}
                    {withTempPass || <td className="py-3 px-6 text-center">
                      <div className="flex space-x-2 justify-center">
                        <ButtonComponent
                          label="Save"
                          type={ButtonType.Success}
                          onClick={handleEditSubmit}
                        />
                        <ButtonComponent
                          label="Cancel"
                          type={ButtonType.Secondary}
                          onClick={handleCancelEdit}
                        />
                      </div>
                    </td>}
                  </>
                ) : (
                  <>
                    <td className="py-3 px-6 text-center">{user.id}</td>
                    <td className="py-3 px-6 text-center">{user.username}</td>
                    {withTempPass || <td className="py-3 px-6 text-center">{user.worker_id}</td>}
                    {withTempPass || <td className="py-3 px-6 text-center">{user.first_name}</td>}
                    {withTempPass || <td className="py-3 px-6 text-center">{user.last_name}</td>}
                    <td className="py-3 px-6 text-center">{user.role_name}</td>
                    {withTempPass || <td className="py-3 px-6 text-center">
                      {user.department_name}
                    </td>}
                    {editMode && (
                      <td className="py-3 px-6 text-center">
                        <div className="flex space-x-2 justify-center">
                          <ButtonComponent
                            label="Edit"
                            type={ButtonType.Secondary}
                            onClick={() => handleEdit(user)}
                          />
                          <ButtonComponent
                            label="Temp Pass"
                            type={ButtonType.Warning}
                            onClick={() => handleTempPass(user.id)}
                          />
                          <ButtonComponent
                            label="Delete"
                            type={ButtonType.Danger}
                            onClick={() => confirmDelete(user.id)} // Open confirmation modal
                          />
                        </div>
                      </td>
                    )}
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination
        currentPage={paginationData.page}
        totalPages={paginationData.total_pages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UserTable;
