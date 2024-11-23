// src/components/PayrollDetailsTab.tsx

import React, { useState, useEffect } from 'react';
import { PayrollDetail } from "../../../types/Worker";
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from "react-toastify";
import api from "../../../api/axiosConfig";
import { getErrorMessage } from "../../../utils/errorHandler";

interface PayrollDetailsTabProps {
  payrollDetail: PayrollDetail;
  workerId: number; // Added to identify the worker
  onUpdatePayrollDetails: () => void; // Callback to refresh data after update
}

const PayrollDetailsTab: React.FC<PayrollDetailsTabProps> = ({ payrollDetail, workerId, onUpdatePayrollDetails }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<PayrollDetail>>({ ...payrollDetail });

  // Effect to reset formData when payrollDetail prop changes
  useEffect(() => {
    setFormData({ ...payrollDetail });
  }, [payrollDetail]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'children_tax_allowance' || name === 'tax_class'
          ? value === '' ? undefined : Number(value)
          : value,
    }));
  };
  

  // Handle edit button click
  const handleEdit = () => {
    setEditMode(true);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setFormData({ ...payrollDetail });
    setEditMode(false);
  };

  
  

  // Handle save button click
  const handleSave = async () => {
    try {
      // Validate required fields if necessary
  
      // Prepare the payload
      const payload = {
        payroll_detail:{
          address: formData.address,
          nationality: formData.nationality,
          tax_class: formData.tax_class,
          children_tax_allowance: formData.children_tax_allowance,
          tax_id_number: formData.tax_id_number,
          social_security_number: formData.social_security_number,
          health_insurance_provider: formData.health_insurance_provider,
        },
      };
  
      // Send PUT request to update payroll details
      await api.put<PayrollDetail>(
        `/workers/${workerId}`,
        payload
      );
  
      toast.success("Szczegóły wynagrodzenia zostały zaktualizowane pomyślnie.");
      setEditMode(false);
      onUpdatePayrollDetails(); // Refresh data in parent component
    } catch (error: any) {
      const errorMessage = getErrorMessage(error);
      console.error("Error updating payroll details:", error);
      toast.error(`Wystąpił błąd: ${errorMessage}`);
    }
  };
  

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border">
      {/* Header Section */}
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Szczegóły Pracownika
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Informacje dotyczące pracownika.
        </p>
      </div>

      {/* Detail Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {/* Address */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Adres
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  placeholder="Wprowadź adres"
                />
              ) : (
                payrollDetail.address || "Brak danych"
              )}
            </dd>
          </div>

          {/* Nationality */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Narodowość
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality || ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  placeholder="Wprowadź narodowość"
                />
              ) : (
                payrollDetail.nationality || "Brak danych"
              )}
            </dd>
          </div>

          {/* Tax Class */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Klasa Podatkowa
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <select
                  name="tax_class"
                  value={formData.tax_class ?? ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Wybierz klasę podatkową</option>
                  <option value="1">I</option>
                  <option value="2">II</option>
                  <option value="3">III</option>
                  <option value="4">IV</option>
                  <option value="5">V</option>
                  <option value="6">VI</option>
                </select>
              ) : (
                payrollDetail.tax_class || "Brak danych"
              )}
            </dd>
          </div>

          {/* Children Tax Allowance */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Ulga Podatkowa na Dzieci
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <input
                  type="number"
                  name="children_tax_allowance"
                  value={formData.children_tax_allowance ?? ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  min={0}
                  placeholder="Wprowadź ilość ulg"
                />
              ) : (
                payrollDetail.children_tax_allowance !== null
                  ? payrollDetail.children_tax_allowance
                  : "Brak danych"
              )}
            </dd>
          </div>

          {/* Tax ID Number */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Numer Identyfikacji Podatkowej
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <input
                  type="text"
                  name="tax_id_number"
                  value={formData.tax_id_number || ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  placeholder="Wprowadź numer NIP"
                />
              ) : (
                payrollDetail.tax_id_number || "Brak danych"
              )}
            </dd>
          </div>

          {/* Social Security Number */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Numer Ubezpieczenia Społecznego
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <input
                  type="text"
                  name="social_security_number"
                  value={formData.social_security_number || ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  placeholder="Wprowadź numer ZUS"
                />
              ) : (
                payrollDetail.social_security_number || "Brak danych"
              )}
            </dd>
          </div>

          {/* Health Insurance Provider */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Dostawca Ubezpieczenia Zdrowotnego
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {editMode ? (
                <input
                  type="text"
                  name="health_insurance_provider"
                  value={formData.health_insurance_provider || ''}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                  placeholder="Wprowadź dostawcę Ubezpieczenia Zdrowotnego"
                />
              ) : (
                payrollDetail.health_insurance_provider || "Brak danych"
              )}
            </dd>
          </div>

          {/* Actions */}
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              {/* Empty Term for alignment */}
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                    aria-label="Save Payroll Details"
                  >
                    <FaSave className="mr-2" /> Zapisz
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                    aria-label="Cancel Editing"
                  >
                    <FaTimes className="mr-2" /> Anuluj
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  aria-label="Edit Payroll Details"
                >
                  <FaEdit className="mr-2" /> Edytuj
                </button>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PayrollDetailsTab;
