// src/components/PayrollDetailsTab.tsx
import React, { useEffect, useState } from 'react';
import { PayrollDetails } from '../../../types/Worker';
import api from '../../../api/axiosConfig';


interface PayrollDetailsTabProps {
  workerId: number;
}

const PayrollDetailsTab: React.FC<PayrollDetailsTabProps> = ({ workerId }) => {
  const [payrollDetails, setPayrollDetails] = useState<PayrollDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayrollDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<PayrollDetails>(`/payroll_details/${workerId}`);
        setPayrollDetails(response.data);
      } catch (err: unknown) {
        console.error('Error fetching Payroll Details data:', err);
        setError('Błąd podczas pobierania danych płacowych.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollDetails();
  }, [workerId]);

  if (loading) {
    return <p className="text-center">Ładowanie danych płacowych...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!payrollDetails) {
    return <p className="text-center">Brak danych płacowych.</p>;
  }

  return (
    <div>
      <p>
        <strong>Wynagrodzenie:</strong> {payrollDetails.salary} PLN
      </p>
      <p>
        <strong>Premia:</strong> {payrollDetails.bonus} PLN
      </p>
      <p>
        <strong>Potrącenia:</strong> {payrollDetails.deductions} PLN
      </p>
    </div>
  );
};

export default PayrollDetailsTab;
