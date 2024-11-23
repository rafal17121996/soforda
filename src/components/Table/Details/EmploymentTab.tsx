import React from 'react'
import { Employment } from '../../../types/Worker';

interface EmploymentTabProps {
  employment: Employment[];
}

const EmploymentTab: React.FC<EmploymentTabProps> = ({ employment }) => {
  if (employment.length === 0) {
    return <p>Brak danych dotyczących zatrudnienia.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Company Name</th>
            <th className="py-3 px-6 text-left">Start Date</th>
            <th className="py-3 px-6 text-left">End Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {employment.map((dl) => (
            <tr key={dl.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left">{dl.company_id}</td>
              <td className="py-3 px-6 text-left">
                {new Date(dl.start_date).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">
                {new Date(dl.end_date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


 export default EmploymentTab;
