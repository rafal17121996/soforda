// src/components/DepartmentTab.tsx
import React from 'react';
import { DriverCard } from '../../../types/Worker';

interface DriverCardTabProps {
  driverCards: DriverCard[];
}

const DriverCardTab: React.FC<DriverCardTabProps> = ({ driverCards }) => {
  if (driverCards.length === 0) {
    return <p>Brak danych dotyczących kart kierowców.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Numer Karty</th>
            <th className="py-3 px-6 text-left">Wydawca</th>
            <th className="py-3 px-6 text-left">Numer Prawa Jazdy</th>
            <th className="py-3 px-6 text-left">Data Wydania</th>
            <th className="py-3 px-6 text-left">Data Wygaśnięcia</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {driverCards.map((card) => (
            <tr key={card.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{card.card_number}</td>
              <td className="py-3 px-6 text-left">{card.issuing_authority}</td>
              <td className="py-3 px-6 text-left">{card.driving_license_number}</td>
              <td className="py-3 px-6 text-left">
                {new Date(card.date_issued).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                {new Date(card.valid_until).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                {card.active ? (
                  <span className="flex items-center text-green-500">
                    Aktywny
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    Nieaktywny
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverCardTab;
