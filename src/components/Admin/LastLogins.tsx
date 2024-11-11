// src/components/LastLogins.tsx

import React, { useEffect, useState } from "react";
import { LoginHistory } from "../../types/LoginHistory";
import api from "../../api/axiosConfig";
import { ComponentName } from "../ComponentName";
import Pagination from "../Pagination"; // Ensure this path is correct

interface LoginHistoryResponse {
  items: LoginHistory[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

const LastLogins: React.FC = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10); // Adjust based on preference

  const fetchLoginHistory = async (page: number, size: number) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<LoginHistoryResponse>("/login_history", {
        params: {
          page,
          size,
          format: "json", // Assuming the API supports this parameter
        },
      });

      // Ensure response.data.items is an array
      if (Array.isArray(response.data.items)) {
        setLoginHistory(response.data.items);
      } else {
        setLoginHistory([]);
        setError("Otrzymano nieprawidłowe dane z serwera.");
      }

      setTotalPages(response.data.pages);
      setPageSize(response.data.size)
    } catch (err: unknown) {
      console.error(err);
      setError("Błąd podczas pobierania historii logowań.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return <p>Ładowanie historii logowań...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex flex-col items-center">
        <ComponentName name="Last login" />
      </div>

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th className="py-3 px-6 text-left">Login ID</th>
            <th className="py-3 px-6 text-left">Nazwa użytkownika</th>
            <th className="py-3 px-6 text-left">Adres IP</th>
            <th className="py-3 px-6 text-left">Czas logowania</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {loginHistory.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-3 px-6 text-center">
                Brak historii logowań.
              </td>
            </tr>
          ) : (
            loginHistory.map((login) => (
              <tr
                key={login.login_id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left">{login.login_id}</td>
                <td className="py-3 px-6 text-left">{login.username}</td>
                <td className="py-3 px-6 text-left">{login.ip_address}</td>
                <td className="py-3 px-6 text-left">
                  {new Date(login.timestamp).toLocaleString("pl-PL")}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        // Optionally, you can pass pageSize and setPageSize if your Pagination component supports it
      />
    </div>
  );
};

export default LastLogins;
