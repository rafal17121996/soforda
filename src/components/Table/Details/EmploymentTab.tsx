import React, { useState, useEffect } from "react";
import { Employment } from "../../../types/Worker";
import api from "../../../api/axiosConfig";
import { toast } from "react-toastify";
import { ButtonComponent } from "../../ButtonComponent";
import { ButtonType } from "../../../enums/ButtonType";

interface EmploymentTabProps {
  employment: Employment[];
  id: number; // worker_id
}

const EmploymentTab: React.FC<EmploymentTabProps> = ({ employment, id }) => {
  const [employments, setEmployments] = useState<Employment[]>(employment);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Employment>({
    start_date: "",
    end_date: "",
    worker_id: id,
    company_id: 0,
    id: 0,
    worker_first_name: "",
    worker_last_name: "",
    company_name: "",
  });

  useEffect(() => {
    setEmployments(employment);
  }, [employment]);

  const handleAddEmployment = () => {
    setFormData({
      start_date: "",
      end_date: "",
      worker_id: id,
      company_id: 0,
      id: 0,
      worker_first_name: "",
      worker_last_name: "",
      company_name: "",
    });
    setIsAdding(true);
  };

  const handleEditEmployment = (emp: Employment) => {
    setFormData(emp);
    setEditingId(emp.id);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      start_date: "",
      end_date: "",
      worker_id: id,
      company_id: 0,
      id: 0,
      worker_first_name: "",
      worker_last_name: "",
      company_name: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        // Dodawanie nowego zatrudnienia
        const response = await api.post<{ data: Employment }>(
          "/employments",
          formData
        );
        setEmployments((prev) => [...prev, response.data.data]);
        toast.success("Employment added successfully.");
      } else if (editingId !== null) {
        // Edycja istniejącego zatrudnienia
        const response = await api.put<{ data: Employment }>(
          `/employments/${editingId}`,
          formData
        );
        setEmployments((prev) =>
          prev.map((emp) => (emp.id === editingId ? response.data.data : emp))
        );
        toast.success("Employment updated successfully.");
      }
      handleCancel();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving employment data.");
    }
  };

  const handleDelete = async (empId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employment entry?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`/employments/${empId}`);
      setEmployments((prev) => prev.filter((emp) => emp.id !== empId));
      toast.success("Employment deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while deleting employment data.");
    }
  };

  return (
    <div className="overflow-x-auto min-w-full">
      <button
        onClick={handleAddEmployment}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Employment
      </button>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Company Name</th>
            <th className="py-3 px-6 text-left">Start Date</th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {employments.map((emp) => (
            <tr
              key={emp.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {editingId === emp.id ? (
                <>
                  <td className="py-3 px-6 text-left">
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Company Name"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="py-3 px-6 text-left">
                    <button
                      onClick={handleSave}
                      className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-6 text-left">
                    {emp.company_name || emp.company_id}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {emp.start_date
                      ? new Date(emp.start_date).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {emp.end_date
                      ? new Date(emp.end_date).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-3 px-6 text-left flex gap-2">
                    <ButtonComponent
                      label="Edit"
                      className="text-yellow-400 group-hover:bg-yellow-400 group-hover:text-white"
                      type={ButtonType.Icon}
                      onClick={() => handleEditEmployment(emp)}
                    />
                    <ButtonComponent
                      label="Delete"
                      type={ButtonType.Icon}
                      className="text-red-500 group-hover:bg-red-500 group-hover:text-white"
                      onClick={() => handleDelete(emp.id)} // Open confirmation modal
                    />
                  </td>
                </>
              )}
            </tr>
          ))}
          {isAdding && (
            <tr className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full"
                  placeholder="Company Name"
                />
              </td>
              <td className="py-3 px-6 text-left">
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="py-3 px-6 text-left">
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="py-3 px-6 text-left">
                <button
                  onClick={handleSave}
                  className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </td>
            </tr>
          )}
          {employments.length === 0 && !isAdding && (
            <tr>
              <td colSpan={4} className="py-3 px-6 text-center">
                Brak danych dotyczących zatrudnienia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmploymentTab;
