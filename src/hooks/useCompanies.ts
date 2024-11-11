// src/hooks/useCompanies.ts
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import api from '../api/axiosConfig';
import { handleAxiosError } from '../utils/handleAxiosError';
import { toast } from 'react-toastify';

interface Company {
  id: number;
  name: string;
  address: string;
  number_of_employments: number;
}

interface CompaniesResponse {
  items: Company[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => void;
  addCompany: (company: { name: string; address: string }) => Promise<void>;
  updateCompany: (id: number, company: { name: string; address: string }) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
}

export const useCompanies = (): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CompaniesResponse>('/companies', {
        params: {
          format: 'json',
          page: 1, // Adjust as needed
          size: 100, // Adjust as needed
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setCompanies(response.data.items);
      } else {
        setCompanies([]);
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
    fetchCompanies();
  }, [fetchCompanies]);

  const addCompany = async (company: { name: string; address: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/companies', company);
      if (response.status === 201 || response.status === 200) {
        toast.success(`Company "${response.data.data.name}" added successfully.`);
        fetchCompanies(); // Refresh the companies list
      } else {
        toast.error('Failed to add company. Please try again.');
      }
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (id: number, company: { name: string; address: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/companies/${id}`, company);
      toast.success(`Company "${company.name}" updated successfully.`);
      fetchCompanies(); // Refresh the companies list
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/companies/${id}`);
      toast.success(`Company deleted successfully.`);
      fetchCompanies(); // Refresh the companies list
    } catch (err: unknown) {
      handleAxiosError(err);
    } finally {
      setLoading(false);
    }
  };

  return { companies, loading, error, fetchCompanies, addCompany, updateCompany, deleteCompany };
};
