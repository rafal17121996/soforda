import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { EmploymentData } from '../../types/Employment';
import { getErrorMessage } from '../../utils/errorHandler';

interface EmploymentProps {
  workerId: number;
}

export const Employment: React.FC<EmploymentProps> = ({ workerId }) => {
  const [employmentData, setEmploymentData] = useState<EmploymentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmploymentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<EmploymentData[]>(`/employment/worker/${workerId}`);
        setEmploymentData(response.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchEmploymentData();
  }, [workerId]);

  if (loading) {
    return <p>Ładowanie danych o zatrudnieniu...</p>;
  }

  if (error) {
    return <p className="text-red-500">Błąd: {error}</p>;
  }

  if (employmentData.length === 0) {
    return <p>Brak danych o zatrudnieniu dla tego pracownika.</p>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Historia Zatrudnienia</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Data Rozpoczęcia</th>
            <th className="py-2 px-4 border-b">Data Zakończenia</th>
            <th className="py-2 px-4 border-b">ID Firmy</th>
          </tr>
        </thead>
        <tbody>
          {employmentData.map((employment) => (
            <tr key={employment.id}>
              <td className="py-2 px-4 border-b">{employment.start_date}</td>
              <td className="py-2 px-4 border-b">{employment.end_date || 'Obecnie'}</td>
              <td className="py-2 px-4 border-b">{employment.company_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employment;
