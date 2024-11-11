// src/hooks/useAssignedWorkers.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';

interface Worker {
  first_name: string;
  middle_name: string;
  last_name: string;
  birthday: string;
  id: number;
  department_id: number;
  department_name: string;
}

interface WorkersResponse {
  items: Worker[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface UseAssignedWorkersReturn {
  workers: Worker[];
  loading: boolean;
  error: string | null;
}

export const useAssignedWorkers = (include_worker_id?: number): UseAssignedWorkersReturn => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          is_assigned: true,
          include_worker: include_worker_id,
          format: 'json',
          page: 1, // Adjust as needed
          size: 100, // Adjust as needed
        };

        const response = await api.get<WorkersResponse>('/workers', { params });

        if (response.status === 200 && Array.isArray(response.data.items)) {
          setWorkers(response.data.items);
        } else {
          setWorkers([]);
          setError('Invalid data format received from server.');
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.detail || err.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [include_worker_id]);

  return { workers, loading, error };
};
