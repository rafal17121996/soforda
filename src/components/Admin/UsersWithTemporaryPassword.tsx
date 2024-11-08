// src/components/UsersWithTemporaryPassword.tsx
import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import { User } from "../../types/User";
import { PaginationData } from "../../types/PaginationData";
import api from "../../api/axiosConfig";
import { UserResponse } from "../../types/UserResponse";
import { ComponentName } from "../ComponentName";


const UsersWithTemporaryPassword: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 1,
    page_size: 10,
    total_count: 0,
    total_pages: 1,
  });

  // Function to fetch users with temporary passwords
  const fetchUsers = async (
    search: string = "",
    page: number = paginationData.page
  ) => {
    try {
      setLoading(true);
      let endpoint = `/users?page=${page}&size=${paginationData.page_size}&is_temporary_password=true`;
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }
      const response = await api.get<UserResponse>(endpoint);

      setUsers(response.data.items);

      setPaginationData({
        page: response.data.page || 1,
        page_size: response.data.size || 10,
        total_count: response.data.total || 0,
        total_pages: response.data.pages || 1,
      });

      setError("");
    } catch (err: unknown) {
      console.error(err);
      setError("Błąd podczas pobierania użytkowników z hasłem tymczasowym.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Handle page changes
  const handlePageChange = (page: number) => {
    fetchUsers('', page);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header and Search */}
      <div className="flex flex-col items-center">
        <ComponentName name="Users with Temporary Password"/>
        {/* <Search handleSubmit={handleSearch} /> */}
      </div>

      {/* User Table */}
      <UserTable
        users={users}
        error={error}
        loading={loading}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        editMode={false}
      />
    </div>
  );
};

export default UsersWithTemporaryPassword;
