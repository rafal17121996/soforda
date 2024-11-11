// src/components/Departments.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ButtonType } from '../enums/ButtonType';
import { handleAxiosError } from '../utils/handleAxiosError';
import { ButtonComponent } from '../components/ButtonComponent';
import ConfirmationModal from '../components/ConfirmationModal';
import { useDepartments } from '../hooks/useDepartments';

interface Department {
  id: number;
  name: string;
  is_active: boolean;
  workers_count: number;
  workers: Worker[];
}

interface Worker {
  id: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

const Departments: React.FC = () => {
  const { departments, loading, error, addDepartment, updateDepartment, deleteDepartment } = useDepartments();

  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    is_active: boolean;
  }>({ name: '', is_active: true });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<{
    name: string;
  }>({ name: '' });

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
    return <p className="text-red-500">Błąd podczas ładowania departamentów: {error}</p>;
  }

  // Handlers for Editing a Department
  const handleEditClick = (department: Department) => {
    setEditingDepartmentId(department.id);
    setEditFormData({ name: department.name, is_active: department.is_active });
  };

  const handleCancelEdit = () => {
    setEditingDepartmentId(null);
    setEditFormData({ name: '', is_active: true });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (id: number) => {
    // Podstawowa walidacja
    if (editFormData.name.trim() === '') {
      toast.error('Nazwa departamentu nie może być pusta.');
      return;
    }

    try {
      const deactivate = !editFormData.is_active;
      await updateDepartment(id, {
        name: editFormData.name,
        deactivate: deactivate,
      });
      setEditingDepartmentId(null);
      setEditFormData({ name: '', is_active: true });
    } catch (err: unknown) {
      handleAxiosError(err);
    }
  };

  // Handlers for Deleting a Department
  const handleDeleteClick = (id: number) => {
    setDepartmentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (departmentToDelete === null) return;

    try {
      await deleteDepartment(departmentToDelete);
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
    } catch (err: unknown) {
      handleAxiosError(err);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDepartmentToDelete(null);
  };

  // Handlers for Creating a Department
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({ name: '' });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ name: '' });
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
  };

  const handleCreateDepartment = async () => {
    // Podstawowa walidacja
    if (createFormData.name.trim() === '') {
      toast.error('Nazwa departamentu nie może być pusta.');
      return;
    }

    try {
      await addDepartment({
        name: createFormData.name,
      });
      handleCloseCreateModal();
    } catch (err: unknown) {
      handleAxiosError(err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create Department Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Zarządzanie Departamentami</h2>
        <ButtonComponent
          label="Dodaj Departament"
          type={ButtonType.Primary}
          onClick={handleOpenCreateModal}
        />
      </div>

      {/* Departments Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Nazwa</th>
            <th className="py-3 px-6 text-center">Liczba Pracowników</th>
            <th className="py-3 px-6 text-center">Aktywny</th>
            <th className="py-3 px-6 text-center">Akcje</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {departments.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-3 px-6 text-center">
                Brak dostępnych departamentów.
              </td>
            </tr>
          ) : (
            departments.map((department: Department) => (
              <tr key={department.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-center">{department.id}</td>
                <td className="py-3 px-6 text-center">
                  {editingDepartmentId === department.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className="border rounded px-2 py-1 w-full text-center"
                    />
                  ) : (
                    department.name
                  )}
                </td>
                <td className="py-3 px-6 text-center">{department.workers_count}</td>
                <td className="py-3 px-6 text-center">
                  {editingDepartmentId === department.id ? (
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editFormData.is_active}
                      onChange={handleEditInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={department.is_active}
                      disabled
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingDepartmentId === department.id ? (
                    <div className="flex justify-center space-x-2">
                      <ButtonComponent
                        label="Zapisz"
                        type={ButtonType.Success}
                        onClick={() => handleSave(department.id)}
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
                        label="Edytuj"
                        type={ButtonType.Primary}
                        onClick={() => handleEditClick(department)}
                      />
                      <ButtonComponent
                        label="Usuń"
                        type={ButtonType.Danger}
                        onClick={() => handleDeleteClick(department.id)}
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
        isOpen={isDeleteModalOpen}
        title="Potwierdź Usunięcie"
        message="Czy na pewno chcesz usunąć ten departament? Ta akcja jest nieodwracalna."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        cancel={true}
      />

      {/* Modal for Creating a Department */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Dodaj Nowy Departament</h3>
            <div className="mb-4">
              <label htmlFor="department-name" className="block text-gray-700 mb-2">
                Nazwa Departamentu
              </label>
              <input
                type="text"
                id="department-name"
                name="name"
                value={createFormData.name}
                onChange={handleCreateInputChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Wprowadź nazwę departamentu"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <ButtonComponent
                label="Anuluj"
                type={ButtonType.Secondary}
                onClick={handleCloseCreateModal}
              />
              <ButtonComponent
                label="Dodaj"
                type={ButtonType.Success}
                onClick={handleCreateDepartment}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
