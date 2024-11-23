// src/hooks/useRoles.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';
import { handleAxiosError } from '../utils/handleAxiosError';
import { toast } from 'react-toastify';

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
  fetchRoles: (page: number, size: number) => Promise<void>;
  addRole: (role: { name: string; permissions: number[] }) => Promise<void>;
  updateRole: (id: number, role: { name: string; permissions: number[] }) => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
  totalPages: number;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchRoles = useCallback(async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RolesResponse>('/roles', {
        params: {
          format: 'json',
          page,
          size,
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setRoles(response.data.items);
        setTotalPages(response.data.pages);
      } else {
        setRoles([]);
        setError('Invalid data format received from server.');
      }
    } catch (err: unknown) {
      handleAxiosError(err);
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
    // Optionally, fetch the first page by default
    // fetchRoles(1, 10);
  }, [fetchRoles]);

  const addRole = async (role: { name: string; permissions: number[] }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/roles', role);
      if (response.status === 201 || response.status === 200) {
        toast.success(`Role "${response.data.data.name}" created successfully.`);
        fetchRoles(1, 10); // Refresh the first page
      } else {
        toast.error('Failed to create role. Please try again.');
      }
    } catch (err: unknown) {
      handleAxiosError(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: number, role: { name: string; permissions: number[] }) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/roles/${id}`, role);
      toast.success(`Role "${role.name}" updated successfully.`);
      fetchRoles(1, 10); // Refresh the first page
    } catch (err: unknown) {
      handleAxiosError(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/roles/${id}`);
      toast.success(`Role deleted successfully.`);
      fetchRoles(1, 10); // Refresh the first page
    } catch (err: unknown) {
      handleAxiosError(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { roles, loading, error, fetchRoles, addRole, updateRole, deleteRole, totalPages };
};
