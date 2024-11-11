// src/components/Companies.tsx
import React, { useState } from "react";
import { useCompanies } from "../hooks/useCompanies";
import { toast } from "react-toastify";
import { ButtonType } from "../enums/ButtonType";
import { ButtonComponent } from "../components/ButtonComponent";
import ConfirmationModal from "../components/ConfirmationModal";
import { handleAxiosError } from "../utils/handleAxiosError";

interface Company {
  id: number;
  name: string;
  address: string;
  number_of_employments: number;
}

const Companies: React.FC = () => {
  const {
    companies,
    loading,
    error,
    addCompany,
    updateCompany,
    deleteCompany,
  } = useCompanies();

  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    address: string;
  }>({ name: "", address: "" });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [createFormData, setCreateFormData] = useState<{
    name: string;
    address: string;
  }>({ name: "", address: "" });

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
    return <p className="text-red-500">Error loading companies: {error}</p>;
  }

  // Handlers for Editing a Company
  const handleEditClick = (company: Company) => {
    setEditingCompanyId(company.id);
    setEditFormData({ name: company.name, address: company.address });
  };

  const handleCancelEdit = () => {
    setEditingCompanyId(null);
    setEditFormData({ name: "", address: "" });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id: number) => {
    // Basic validation
    if (editFormData.name.trim() === "" || editFormData.address.trim() === "") {
      toast.error("Name and Address cannot be empty.");
      return;
    }

    try {
      await updateCompany(id, {
        name: editFormData.name,
        address: editFormData.address,
      });
      setEditingCompanyId(null);
      setEditFormData({ name: "", address: "" });
    }catch (err: unknown) {
        handleAxiosError(err);
    }
  };

  // Handlers for Deleting a Company
  const handleDeleteClick = (id: number) => {
    setCompanyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (companyToDelete === null) return;

    try {
      await deleteCompany(companyToDelete);
      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);
    } catch (err: unknown) {
        handleAxiosError(err);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCompanyToDelete(null);
  };

  // Handlers for Creating a Company
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({ name: "", address: "" });
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData({ name: "", address: "" });
  };

  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateFormData({ ...createFormData, [e.target.name]: e.target.value });
  };

  const handleCreateCompany = async () => {
    // Basic validation
    if (
      createFormData.name.trim() === "" ||
      createFormData.address.trim() === ""
    ) {
      toast.error("Name and Address cannot be empty.");
      return;
    }

    try {
      await addCompany({
        name: createFormData.name,
        address: createFormData.address,
      });
      handleCloseCreateModal();
    } catch (error: unknown) {
      handleAxiosError(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with Create Company Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Companies Management</h2>
        <ButtonComponent
          label="Add Company"
          type={ButtonType.Primary}
          onClick={handleOpenCreateModal}
        />
      </div>

      {/* Companies Table */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-center">ID</th>
            <th className="py-3 px-6 text-center">Name</th>
            <th className="py-3 px-6 text-center">Address</th>
            <th className="py-3 px-6 text-center">Number of Employments</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {companies.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-3 px-6 text-center">
                No companies available.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <tr
                key={company.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-center">{company.id}</td>
                <td className="py-3 px-6 text-center">
                  {editingCompanyId === company.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className="border rounded px-2 py-1 w-full text-center"
                    />
                  ) : (
                    company.name
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingCompanyId === company.id ? (
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditInputChange}
                      className="border rounded px-2 py-1 w-full text-center"
                    />
                  ) : (
                    company.address
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {company.number_of_employments}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingCompanyId === company.id ? (
                    <div className="flex justify-center space-x-2">
                      <ButtonComponent
                        label="Save"
                        type={ButtonType.Success}
                        onClick={() => handleSave(company.id)}
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
                        onClick={() => handleEditClick(company)}
                      />
                      <ButtonComponent
                        label="Delete"
                        type={ButtonType.Danger}
                        onClick={() => handleDeleteClick(company.id)}
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
        title="Confirm Deletion"
        message="Are you sure you want to delete this company? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        cancel={true}
      />

      {/* Modal for Creating a Company */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Company</h3>
            <div className="mb-4">
              <label
                htmlFor="company-name"
                className="block text-gray-700 mb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company-name"
                name="name"
                value={createFormData.name}
                onChange={handleCreateInputChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter company name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="company-address"
                className="block text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                type="text"
                id="company-address"
                name="address"
                value={createFormData.address}
                onChange={handleCreateInputChange}
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter company address"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <ButtonComponent
                label="Cancel"
                type={ButtonType.Secondary}
                onClick={handleCloseCreateModal}
              />
              <ButtonComponent
                label="Add"
                type={ButtonType.Success}
                onClick={handleCreateCompany}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
