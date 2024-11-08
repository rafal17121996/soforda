// src/components/LastLogins.tsx

import React, { useEffect, useState } from "react";
import { LoginHistory } from "../../types/LoginHistory";
import api from "../../api/axiosConfig";
import { ComponentName } from "../ComponentName";

const LastLogins: React.FC = () => {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchLoginHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get<LoginHistory[]>("/login_history");
      setLoginHistory(response.data);
    } catch (err) {
      console.error(err);
      setError("Błąd podczas pobierania historii logowań.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginHistory();
  }, []);

  if (loading) {
    return <p>Ładowanie historii logowań...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="overflow-x-auto p-5">
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
          {loginHistory.map((login) => (
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LastLogins;
