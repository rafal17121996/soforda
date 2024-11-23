// src/components/DriverCardTab.tsx

import React, { useState } from 'react';
import { DriverCard } from '../../../types/Worker';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface DriverCardTabProps {
  driverCards: DriverCard[];
}

const DriverCardTab: React.FC<DriverCardTabProps> = ({ driverCards }) => {
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<DriverCard>>({});

  const handleEdit = (card: DriverCard) => {
    setEditId(card.id);
    setFormData({ ...card });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({});
  };

  const handleSave = () => {
    // Implement save functionality here, e.g., API call
    console.log('Saving:', formData);
    setEditId(null);
    setFormData({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 overflow-x-auto">
      {driverCards.length === 0 ? (
        <p className="text-center text-gray-500">Brak danych dotyczących kart kierowców.</p>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">Numer Karty</th>
              <th className="py-3 px-6 text-left">Wydawca</th>
              <th className="py-3 px-6 text-left">Numer Prawa Jazdy</th>
              <th className="py-3 px-6 text-left">Data Wydania</th>
              <th className="py-3 px-6 text-left">Data Wygaśnięcia</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {driverCards.map((card) => (
              <tr key={card.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <input
                      type="text"
                      name="card_number"
                      value={formData.card_number || ''}
                      onChange={handleChange}
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    card.card_number
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <input
                      type="text"
                      name="issuing_authority"
                      value={formData.issuing_authority || ''}
                      onChange={handleChange}
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    card.issuing_authority
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <input
                      type="text"
                      name="driving_license_number"
                      value={formData.driving_license_number || ''}
                      onChange={handleChange}
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    card.driving_license_number
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <input
                      type="date"
                      name="date_issued"
                      value={formData.date_issued ? formData.date_issued.substring(0,10) : ''}
                      onChange={handleChange}
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    new Date(card.date_issued).toLocaleDateString()
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <input
                      type="date"
                      name="valid_until"
                      value={formData.valid_until ? formData.valid_until.substring(0,10) : ''}
                      onChange={handleChange}
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    new Date(card.valid_until).toLocaleDateString()
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <select
                      name="active"
                      value={formData.active ? 'Active' : 'Inactive'}
                      onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          active: e.target.value === 'Active'
                        }))
                      }
                      className="border rounded p-1 w-full"
                    >
                      <option value="Active">Aktywny</option>
                      <option value="Inactive">Nieaktywny</option>
                    </select>
                  ) : (
                    card.active ? (
                      <span className="flex items-center text-green-500">
                        Aktywny
                      </span>
                    ) : (
                      <span className="flex items-center text-red-500">
                        Nieaktywny
                      </span>
                    )
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editId === card.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="text-green-500 hover:text-green-700"
                        aria-label="Save"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(card)}
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverCardTab;
