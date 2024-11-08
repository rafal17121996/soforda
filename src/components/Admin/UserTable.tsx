// src/components/UserTable.tsx
import React, { useState } from "react";
import { User } from "../../types/User";
import Pagination from "../Pagination";
import { PaginationData } from "../../types/PaginationData";
import { ButtonComponent } from "../ButtonComponent";
import { ButtonType } from "../../enums/ButtonType";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../utils/handleAxiosError";
import ConfirmationModal from "../ConfirmationModal";

interface UserTableProps {
  users: User[];
  error: string;
  loading: boolean;
  paginationData: PaginationData;
  onPageChange: (page: number) => void;
  editMode?: boolean;
  onAddUser?: () => void;
  onUserUpdated?: () => void; // Callback to refresh users after update
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  error,
  loading,
  paginationData,
  onPageChange,
  editMode = false,
  onAddUser,
  onUserUpdated,
}) => {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<User | null>(null);

  // State for Confirmation Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenPass, setIsModalOpenPass] = useState<boolean>(false);
  const [temporaryPassword, setTemporaryPassword] = useState<string>('');
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  if (loading) {
    return <p>Loading users...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Handlers for the action buttons
  const handleEdit = (user: User) => {
    // Enable inline editing for the selected user
    setEditingUserId(user.id);
    setEditFormData({ ...user });
  };

  const handleEditChange = (
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
      toast.success(`User with ID ${editingUserId} updated successfully.`);
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
    setEditFormData(null);
  };

  const handleDelete = async () => {
    if (userToDelete === null) return;

    try {
      await api.delete(`/users/${userToDelete}`);
      toast.success(`User with ID ${userToDelete} deleted successfully.`);
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
      console.log(res.data)
      console.log(res.data.data.temporary_password)
      setIsModalOpenPass(true)
      setTemporaryPassword(res.data.data.temporary_password)
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
    setIsModalOpenPass(false)
  };

  return (
    <div className="overflow-x-auto px-5 pb-5">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        cancel={true}
      />
      <ConfirmationModal
        isOpen={isModalOpenPass}
        title="Temporary Password"
        message={`Lorem ipsum. Pass = ${temporaryPassword}`}
        onConfirm={()=>setIsModalOpenPass(false)}
      />

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Worker ID</th>
            <th className="py-3 px-6 text-center">Username</th>
            <th className="py-3 px-6 text-center">First Name</th>
            <th className="py-3 px-6 text-center">Last Name</th>
            <th className="py-3 px-6 text-center">Role</th>
            <th className="py-3 px-6 text-center">Department</th>
            {editMode && (
              <th className="py-3 px-6 text-center">
                <div className="flex items-center gap-5 justify-center">
                  <span>Actions</span>
                  {onAddUser && (
                    <ButtonComponent
                      label="Add User"
                      type={ButtonType.Primary}
                      onClick={onAddUser}
                    />
                  )}
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {editingUserId === user.id && editFormData ? (
                <>
                  <td className="py-3 px-6 text-center">{user.id}</td>
                  <td className="py-3 px-6 text-center">
                    <input
                      type="number"
                      name="worker_id"
                      value={editFormData.worker_id || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-center"
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-center"
                    />
                  </td>
                  <td className="py-3 px-6 text-center">{user.first_name}</td>
                  <td className="py-3 px-6 text-center">{user.last_name}</td>
                  <td className="py-3 px-6 text-center">
                    <input
                      type="text"
                      name="role_name"
                      value={editFormData.role_name || ""}
                      onChange={handleEditChange}
                      className="border px-2 py-1 rounded w-full text-center"
                    />
                  </td>
                  <td className="py-3 px-6 text-center">
                    {user.department_name}
                  </td>
                  <td className="py-3 px-6 text-center">
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
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-6 text-center">{user.id}</td>
                  <td className="py-3 px-6 text-center">{user.worker_id}</td>
                  <td className="py-3 px-6 text-center">{user.username}</td>
                  <td className="py-3 px-6 text-center">{user.first_name}</td>
                  <td className="py-3 px-6 text-center">{user.last_name}</td>
                  <td className="py-3 px-6 text-center">{user.role_name}</td>
                  <td className="py-3 px-6 text-center">
                    {user.department_name}
                  </td>
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
          ))}
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
