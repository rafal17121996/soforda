// src/components/DrivingLicenseTab.tsx

import React from 'react';
import { DrivingLicense } from '../../../types/Worker';

interface DrivingLicenseTabProps {
  drivingLicense: DrivingLicense[];
}

const DrivingLicenseTab: React.FC<DrivingLicenseTabProps> = ({ drivingLicense }) => {
  if (drivingLicense.length === 0) {
    return <p>Brak danych dotyczących prawa jazdy.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Kraj</th>
            <th className="py-3 px-6 text-left">Numer Prawa Jazdy</th>
            <th className="py-3 px-6 text-left">Typy Prawa Jazdy</th>
            <th className="py-3 px-6 text-left">Data Wydania</th>
            <th className="py-3 px-6 text-left">Data Wygaśnięcia</th>
            <th className="py-3 px-6 text-left">Data Wygaśnięcia Kodu 95</th>
            <th className="py-3 px-6 text-left">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {drivingLicense.map((dl) => (
            <tr key={dl.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{dl.id}</td>
              <td className="py-3 px-6 text-left">{dl.country}</td>
              <td className="py-3 px-6 text-left">{dl.number}</td>
              <td className="py-3 px-6 text-left">
                {dl.license_types.join(', ')}
              </td>
              <td className="py-3 px-6 text-left">
                {new Date(dl.date_issued).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                {new Date(dl.valid_until).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                {dl.code_95_valid_until
                  ? new Date(dl.code_95_valid_until).toLocaleDateString()
                  : 'Brak'}
              </td>
              <td className="py-3 px-6 text-left">
                {dl.active ? (
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

export default DrivingLicenseTab;
