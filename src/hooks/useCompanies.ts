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
  fetchCompanies: (page: number, size: number) => Promise<void>;
  addCompany: (company: { name: string; address: string }) => Promise<void>;
  updateCompany: (id: number, company: { name: string; address: string }) => Promise<void>;
  deleteCompany: (id: number) => Promise<void>;
  totalPages: number;
}

export const useCompanies = (): UseCompaniesReturn => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchCompanies = useCallback(async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<CompaniesResponse>('/companies', {
        params: {
          format: 'json',
          page,
          size,
        },
      });

      if (response.status === 200 && Array.isArray(response.data.items)) {
        setCompanies(response.data.items);
        setTotalPages(response.data.pages);
      } else {
        setCompanies([]);
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
    // fetchCompanies(1, 10);
  }, [fetchCompanies]);

  const addCompany = async (company: { name: string; address: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/companies', company);
      if (response.status === 201 || response.status === 200) {
        toast.success(`Company "${response.data.data.name}" added successfully.`);
        fetchCompanies(1, 10); // Refresh the first page
      } else {
        toast.error('Failed to add company. Please try again.');
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

  const updateCompany = async (id: number, company: { name: string; address: string }) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/companies/${id}`, company);
      toast.success(`Company "${company.name}" updated successfully.`);
      fetchCompanies(1, 10); // Refresh the first page
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

  const deleteCompany = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/companies/${id}`);
      toast.success(`Company deleted successfully.`);
      fetchCompanies(1, 10); // Refresh the first page
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

  return { companies, loading, error, fetchCompanies, addCompany, updateCompany, deleteCompany, totalPages };
};
