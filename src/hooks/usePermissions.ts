// src/hooks/usePermissions.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { handleAxiosError } from '../utils/handleAxiosError';

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
  fetchPermissions: (page?: number, size?: number) => Promise<void>;
  addPermission: (permission: { name: string }) => Promise<void>;
  updatePermission: (id: number, permission: { name: string }) => Promise<void>;
  deletePermission: (id: number) => Promise<void>;
  totalPages: number;
}

export const usePermissions = (): UsePermissionsReturn => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchPermissions = useCallback(async (page: number = 1, size: number = 1000) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PermissionsResponse>('/permissions', {
        params: {
          format: 'json',
          page,
          size,
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setPermissions(response.data.items);
        setTotalPages(response.data.pages);
        console.log('Fetched Permissions:', response.data.items);
      } else {
        setPermissions([]);
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
    // Automatically fetch permissions on mount
    fetchPermissions();
  }, []);

  const addPermission = async (permission: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/permissions', permission);
      if (response.status === 201 || response.status === 200) {
        const newPermission = response.data.data;
        toast.success(`Permission "${newPermission.name}" added successfully.`);
        fetchPermissions(); // Refresh the permissions list
      } else {
        toast.error('Failed to add permission. Please try again.');
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

  const updatePermission = async (id: number, permission: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: permission.name,
      };
      await api.put(`/permissions/${id}`, payload);
      toast.success(`Permission "${permission.name}" updated successfully.`);
      fetchPermissions(); // Refresh the permissions list
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

  const deletePermission = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/permissions/${id}`);
      toast.success('Permission deleted successfully.');
      fetchPermissions(); // Refresh the permissions list
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

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    addPermission,
    updatePermission,
    deletePermission,
    totalPages,
  };
};
