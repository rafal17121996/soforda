// src/hooks/useRoles.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';

interface Permission {
  id: number;
  name: string;
}

interface Role {
  name: string;
  id: number;
  permissions: Permission[];
}

interface RolesResponse {
  items: Role[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface UseRolesReturn {
  roles: Role[];
  loading: boolean;
  error: string | null;
  refetchRoles: () => void;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RolesResponse>('/roles', {
        params: {
          format: 'json',
          page: 1, // Adjust as needed
          size: 100, // Adjust as needed
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setRoles(response.data.items);
      } else {
        setRoles([]);
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
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return { roles, loading, error, refetchRoles: fetchRoles };
};
