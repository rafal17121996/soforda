// src/components/Permissions.tsx
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ButtonType } from "../enums/ButtonType";
import { handleAxiosError } from "../utils/handleAxiosError";
import { ButtonComponent } from "../components/ButtonComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import { usePermissions } from "../hooks/usePermissions";
import Pagination from "../components/Pagination"; // Ensure this path is correct

interface Permission {
  id: number;
  name: string;
}

const Permissions: React.FC = () => {
  const [editingPermissionId, setEditingPermissionId] = useState<number | null>(
    null
  );
  const [editFormData, setEditFormData] = useState<{ name: string }>({
    name: "",
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(
    null
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<{ name: string }>({
    name: "",
  });

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; // Fixed page size as per requirement

  const {
    permissions,
    loading,
    error,
    fetchPermissions,
    addPermission,
    updatePermission,
    deletePermission,
    totalPages,
  } = usePermissions();

  useEffect(() => {
    fetchPermissions(currentPage, pageSize);
  }, [fetchPermissions, currentPage, pageSize]);

  // Handlers for Editing a Permission
  const handleEditClick = (permission: Permission) => {
    setEditingPermissionId(permission.id);
    setEditFormData({ name: permission.name });
  };

  const handleCancelEdit = () => {
    setEditingPermissionId(null);
    setEditFormData({ name: "" });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (id: number) => {
    // Basic validation
    if (editFormData.name.trim() === "") {
      toast.error("Nazwa uprawnienia nie może być pusta.");
      return;
    }

    try {
      await updatePermission(id, {
        name: editFormData.name,
      });
      setEditingPermissionId(null);
      setEditFormData({ name: "" });
    } catch (err: unknown) {
      handleAxiosError(err);
    }
  };

  // Handlers for Deleting a Permission
  const handleDeleteClick = (id: number) => {
    setPermissionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (permissionToDelete === null) return;

    try {
      await deletePermission(permissionToDelete);
      setIsDeleteModalOpen(false);
      setPermissionToDelete(null);
    } catch (err: unknown) {
      handleAxiosError(err);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPermissionToDelete(null);
  };

  // Handlers for Creating a Permission
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({ name: "" });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ name: "" });
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
  };

  const handleCreatePermission = async () => {
    // Basic validation
    if (createFormData.name.trim() === "") {
      toast.error("Nazwa uprawnienia nie może być pusta.");
      return;
    }

    try {
      await addPermission({
        name: createFormData.name,
      });
      handleCloseCreateModal();
    } catch (err: unknown) {
      handleAxiosError(err);
    }
  };

  // Handler for Pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-500">Błąd podczas ładowania uprawnień: {error}</p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create Permission Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Zarządzanie Uprawnieniami</h2>
        <ButtonComponent
          label="Dodaj Uprawnienie"
          text="Dodaj Uprawnienie"
          type={ButtonType.Primary}
          onClick={handleOpenCreateModal}
        />
      </div>

      {/* Permissions Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Nazwa</th>
            <th className="py-3 px-6 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {permissions.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-3 px-6 text-center">
                Brak dostępnych uprawnień.
              </td>
            </tr>
          ) : (
            permissions.map((permission: Permission) => (
              <tr
                key={permission.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-center">{permission.id}</td>
                <td className="py-3 px-6 text-center">
                  {editingPermissionId === permission.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className="border rounded px-2 py-1 w-full text-center"
                    />
                  ) : (
                    permission.name
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingPermissionId === permission.id ? (
                    <div className="flex justify-center space-x-2">
                      <ButtonComponent
                        label="Zapisz"
                        type={ButtonType.Success}
                        onClick={() => handleSave(permission.id)}
                      />
                      <ButtonComponent
                        label="Anuluj"
                        type={ButtonType.Secondary}
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-2">
                      <ButtonComponent
                        label="Edit"
                        className="text-yellow-400 group-hover:bg-yellow-400 group-hover:text-white"
                        type={ButtonType.Icon}
                        onClick={() => handleEditClick(permission)}
                      />
                      <ButtonComponent
                        label="Delete"
                        className="text-red-500 group-hover:bg-red-500 group-hover:text-white"
                        type={ButtonType.Icon}
                        onClick={() => handleDeleteClick(permission.id)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Potwierdź Usunięcie"
        message="Czy na pewno chcesz usunąć to uprawnienie? Ta akcja jest nieodwracalna."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        cancel={true}
      />

      {/* Modal for Creating a Permission */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">
              Dodaj Nowe Uprawnienie
            </h3>
            <div className="mb-4">
              <label
                htmlFor="permission-name"
                className="block text-gray-700 mb-2"
              >
                Nazwa Uprawnienia
              </label>
              <input
                type="text"
                id="permission-name"
                name="name"
                value={createFormData.name}
                onChange={handleCreateInputChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Wprowadź nazwę uprawnienia"
              />
            </div>
            <div className="mt-8 p-6 pt-0">
              <div className="flex space-x-2">
                <button
                  className="w-full mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="button"
                  data-dialog-close="true"
                  onClick={handleCloseCreateModal}
                >
                  Zamknij
                </button>
                <button
                  className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  onClick={handleCreatePermission}
                  type="button"
                  data-dialog-close="true"
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permissions;
