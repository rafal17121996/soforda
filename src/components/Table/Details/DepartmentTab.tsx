// src/components/DepartmentTab.tsx
import React, { useEffect, useState } from 'react';
import { DepartmentDetails } from '../../../types/Worker';
import api from '../../../api/axiosConfig';


interface DepartmentTabProps {
  workerId: number;
}

const DepartmentTab: React.FC<DepartmentTabProps> = ({ workerId }) => {
  const [departmentDetails, setDepartmentDetails] = useState<DepartmentDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<DepartmentDetails>(`/department/${workerId}`);
        setDepartmentDetails(response.data);
      } catch (err: unknown) {
        console.error('Error fetching Department data:', err);
        setError('Błąd podczas pobierania danych działu.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentDetails();
  }, [workerId]);

  if (loading) {
    return <p className="text-center">Ładowanie danych działu...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!departmentDetails) {
    return <p className="text-center">Brak danych działu.</p>;
  }

  return (
    <div>
      <p>
        <strong>Nazwa Działu:</strong> {departmentDetails.departmentName}
      </p>
      <p>
        <strong>Kierownik:</strong> {departmentDetails.manager}
      </p>
      <p>
        <strong>Lokalizacja:</strong> {departmentDetails.location}
      </p>
    </div>
  );
};

export default DepartmentTab;
