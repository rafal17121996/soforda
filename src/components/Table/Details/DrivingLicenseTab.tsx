// src/components/DrivingLicenseTab.tsx
import React, { useEffect, useState } from 'react';
import { DrivingLicense } from '../../../types/Worker';
import api from '../../../api/axiosConfig';


interface DrivingLicenseTabProps {
  workerId: number;
}

const DrivingLicenseTab: React.FC<DrivingLicenseTabProps> = ({ workerId }) => {
  const [drivingLicense, setDrivingLicense] = useState<DrivingLicense | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrivingLicense = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<DrivingLicense>(`/driving_license/${workerId}`);
        setDrivingLicense(response.data);
      } catch (err: unknown) {
        console.error('Error fetching Driving License data:', err);
        setError('Błąd podczas pobierania danych prawa jazdy.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrivingLicense();
  }, [workerId]);

  if (loading) {
    return <p className="text-center">Ładowanie danych prawa jazdy...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!drivingLicense) {
    return <p className="text-center">Brak danych prawa jazdy.</p>;
  }

  return (
    <div>
      <p>
        <strong>Typ Prawa Jazdy:</strong> {drivingLicense.licenseType}
      </p>
      <p>
        <strong>Data Wydania:</strong> {drivingLicense.issuedDate}
      </p>
      <p>
        <strong>Data Wygaśnięcia:</strong> {drivingLicense.expiryDate}
      </p>
    </div>
  );
};

export default DrivingLicenseTab;
