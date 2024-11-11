// src/components/Roles.tsx
import React, { useState } from 'react';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import Select, { MultiValue } from 'react-select';
import { toast } from 'react-toastify';
import api from '../api/axiosConfig';
import { handleAxiosError } from '../utils/handleAxiosError';
import { ButtonType } from '../enums/ButtonType';
import { ButtonComponent } from '../components/ButtonComponent';
import ConfirmationModal from '../components/ConfirmationModal';

interface PermissionOption {
  value: number;
  label: string;
}

const Roles: React.FC = () => {
  const { roles, loading: rolesLoading, error: rolesError, refetchRoles } = useRoles();
  const { permissions, loading: permissionsLoading, error: permissionsError } = usePermissions();

  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    permissions: number[];
  }>({ name: '', permissions: [] });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<{
    name: string;
    permissions: number[];
  }>({ name: '', permissions: [] });

  if (rolesLoading || permissionsLoading) {
    return <p>Loading...</p>;
  }

  if (rolesError) {
    return <p className="text-red-500">Error loading roles: {rolesError}</p>;
  }

  if (permissionsError) {
    return <p className="text-red-500">Error loading permissions: {permissionsError}</p>;
  }

  const permissionOptions: PermissionOption[] = permissions.map((perm: { id: number; name: string; }) => ({
    value: perm.id,
    label: perm.name,
  }));

  // Handlers for Editing a Role
  const handleEditClick = (roleId: number, roleName: string, rolePermissions: number[]) => {
    setEditingRoleId(roleId);
    setEditFormData({ name: roleName, permissions: rolePermissions });
  };

  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditFormData({ name: '', permissions: [] });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, name: e.target.value });
  };

  const handleEditPermissionsChange = (selectedOptions: MultiValue<PermissionOption>) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setEditFormData({ ...editFormData, permissions: selectedIds });
  };

  const handleSave = async (roleId: number) => {
    // Basic validation
    if (editFormData.name.trim() === '') {
      toast.error('Role name cannot be empty.');
      return;
    }

    if (editFormData.permissions.length === 0) {
      toast.error('At least one permission must be selected.');
      return;
    }

    try {
      await api.put(`/roles/${roleId}`, {
        name: editFormData.name,
        permissions: editFormData.permissions,
      });
      toast.success(`Role "${editFormData.name}" updated successfully.`);
      setEditingRoleId(null);
      setEditFormData({ name: '', permissions: [] });
      refetchRoles(); // Refresh the roles list
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  // Handlers for Deleting a Role
  const handleDeleteClick = (roleId: number) => {
    setRoleToDelete(roleId);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete === null) return;

    try {
      await api.delete(`/roles/${roleToDelete}`);
      toast.success(`Role deleted successfully.`);
      setIsModalOpen(false);
      setRoleToDelete(null);
      refetchRoles(); // Refresh the roles list
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setRoleToDelete(null);
  };

  // Handlers for Creating a Role
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({ name: '', permissions: [] });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ name: '', permissions: [] });
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({ ...createFormData, name: e.target.value });
  };

  const handleCreatePermissionsChange = (selectedOptions: MultiValue<PermissionOption>) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setCreateFormData({ ...createFormData, permissions: selectedIds });
  };

  const handleCreateRole = async () => {
    // Basic validation
    if (createFormData.name.trim() === '') {
      toast.error('Role name cannot be empty.');
      return;
    }

    if (createFormData.permissions.length === 0) {
      toast.error('At least one permission must be selected.');
      return;
    }

    try {
      const response = await api.post('/roles', {
        name: createFormData.name,
        permissions: createFormData.permissions,
      });

      if (response.status === 201 || response.status === 200) {
        const newRole = response.data.data;
        toast.success(`Role "${newRole.name}" created successfully.`);
        handleCloseCreateModal();
        refetchRoles(); // Refresh the roles list
      } else {
        toast.error('Failed to create role. Please try again.');
      }
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Roles Management</h2>
        <ButtonComponent
          label="Create Role"
          type={ButtonType.Primary}
          onClick={handleOpenCreateModal}
        />
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Name</th>
            <th className="py-3 px-6 text-center">Permissions</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {roles.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-3 px-6 text-center">
                No roles available.
              </td>
            </tr>
          ) : (
            roles.map((role) => (
              <tr key={role.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-center">{role.id}</td>
                <td className="py-3 px-6 text-center">
                  {editingRoleId === role.id ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className="border rounded px-2 py-1 w-full text-center"
                    />
                  ) : (
                    role.name
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingRoleId === role.id ? (
                    <Select
                      isMulti
                      options={permissionOptions}
                      value={permissionOptions.filter((option) =>
                        editFormData.permissions.includes(option.value)
                      )}
                      onChange={handleEditPermissionsChange}
                      className="text-left"
                      placeholder="Select Permissions"
                    />
                  ) : (
                    role.permissions.map((perm) => perm.name).join(', ')
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingRoleId === role.id ? (
                    <div className="flex justify-center space-x-2">
                      <ButtonComponent
                        label="Save"
                        type={ButtonType.Success}
                        onClick={() => handleSave(role.id)}
                      />
                      <ButtonComponent
                        label="Cancel"
                        type={ButtonType.Secondary}
                        onClick={handleCancelEdit}
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center space-x-2">
                      <ButtonComponent
                        label="Edit"
                        type={ButtonType.Primary}
                        onClick={() =>
                          handleEditClick(
                            role.id,
                            role.name,
                            role.permissions.map((perm) => perm.id)
                          )
                        }
                      />
                      <ButtonComponent
                        label="Delete"
                        type={ButtonType.Danger}
                        onClick={() => handleDeleteClick(role.id)}
                      />
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this role? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        cancel={true}
      />

      {/* Modal for Creating a Role */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Create New Role</h3>
            <div className="mb-4">
              <label htmlFor="role-name" className="block text-gray-700 mb-2">
                Role Name
              </label>
              <input
                type="text"
                id="role-name"
                value={createFormData.name}
                onChange={handleCreateInputChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter role name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="role-permissions" className="block text-gray-700 mb-2">
                Permissions
              </label>
              <Select
                isMulti
                options={permissionOptions}
                value={permissionOptions.filter((option) =>
                  createFormData.permissions.includes(option.value)
                )}
                onChange={handleCreatePermissionsChange}
                className="text-left"
                placeholder="Select Permissions"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <ButtonComponent
                label="Cancel"
                type={ButtonType.Secondary}
                onClick={handleCloseCreateModal}
              />
              <ButtonComponent
                label="Create"
                type={ButtonType.Success}
                onClick={handleCreateRole}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;