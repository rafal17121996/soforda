// src/hooks/usePermissions.ts
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';

interface Permission {
  id: number;
  name: string;
}

interface PermissionsResponse {
  items: Permission[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface UsePermissionsReturn {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PermissionsResponse>('/permissions', {
        params: {
          format: 'json',
          page: 1, // Adjust as needed
          size: 100, // Adjust as needed
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setPermissions(response.data.items);
      } else {
        setPermissions([]);
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

  useEffect(() => {
    fetchPermissions();
  }, []);

  return { permissions, loading, error };
};
