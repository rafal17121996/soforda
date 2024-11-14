// src/hooks/useDepartments.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { handleAxiosError } from '../utils/handleAxiosError';

interface Worker {
  id: number;
  first_name: string;
  last_name: string;
  is_active: boolean;
}

interface Department {
  id: number;
  name: string;
  is_active: boolean;
  workers_count: number;
  workers: Worker[];
}

interface DepartmentsResponse {
  items: Department[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface UseDepartmentsReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => void;
  addDepartment: (department: { name: string }) => Promise<void>;
  updateDepartment: (id: number, department: { name: string; deactivate: boolean }) => Promise<void>;
  deleteDepartment: (id: number) => Promise<void>;
}

export const useDepartments = (isActive : boolean): UseDepartmentsReturn => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<DepartmentsResponse>('/departments', {
        params: {
          format: 'json',
          page: 1, // Dostosuj w razie potrzeby
          size: 100, // Dostosuj w razie potrzeby
          is_active: isActive
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setDepartments(response.data.items);
      } else {
        setDepartments([]);
        setError('Otrzymano nieprawidłowy format danych z serwera.');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd.');
      }
    } finally {
      setLoading(false);
    }
  }, [isActive]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const addDepartment = async (department: { name: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/departments', department);
      if (response.status === 201 || response.status === 200) {
        const newDepartment = response.data.data;
        toast.success(`Departament "${newDepartment.name}" dodany pomyślnie.`);
        fetchDepartments(); // Odśwież listę departamentów
      } else {
        toast.error('Nie udało się dodać departamentu. Spróbuj ponownie.');
      }
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id: number, department: { name: string; deactivate: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        name: department.name,
        deactivate: department.deactivate,
      };
      await api.put(`/departments/${id}`, payload);
      const action = department.deactivate ? 'dezaktywowany' : 'zaktualizowany';
      toast.success(`Departament "${department.name}" ${action} pomyślnie.`);
      fetchDepartments(); // Odśwież listę departamentów
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/departments/${id}`);
      toast.success(`Departament usunięty pomyślnie.`);
      fetchDepartments(); // Odśwież listę departamentów
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  return { departments, loading, error, fetchDepartments, addDepartment, updateDepartment, deleteDepartment };
};
