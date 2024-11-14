import React, { useEffect, useState } from "react";
import Search from "../Search";
import { User } from "../../types/User";
import AddUserForm from "./AddUserForm";
import api from "../../api/axiosConfig";
import { PaginationData } from "../../types/PaginationData";
import { ComponentName } from "../ComponentName";
import { Switch } from "../Switch";
import { ExportButton } from "../ExportButton";
import { UserResponse } from "../../types/UserResponse";
import UserTable from "./UserTable";
import { ButtonComponent } from "../ButtonComponent"; // Adjust the path as needed
import { ButtonType } from "../../enums/ButtonType";

export const Users: React.FC = () => {
  const [tempSearch, setTempSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<PaginationData>({
    page: 1,
    page_size: 10,
    total_count: 0,
    total_pages: 1,
  });

  const fetchUsers = async (
    search: string = "",
    page: number = paginationData.page
  ) => {
    try {
      setLoading(true);
      let endpoint = `/users?page=${page}&size=${paginationData.page_size}`;
      if (search) {
        endpoint += `&search=${encodeURIComponent(search)}`;
      }
      const response = await api.get<UserResponse>(endpoint);

      setUsers(response.data.items);

      setPaginationData({
        page: response.data.page ? response.data.page : 1,
        page_size: response.data.size ? response.data.size : 10,
        total_count: response.data.total ? response.data.total : 0,
        total_pages: response.data.pages ? response.data.pages : 1,
      });

      setError("");
    } catch (err: unknown) {
      console.error(err);
      setError("Błąd podczas pobierania użytkowników.");
    } finally {
      //   setTimeout(() => {
      setLoading(false);
      //   }, 2000);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Dodawanie nowego użytkownika
  const handleAddUser = (newUser: User) => {
    setUsers((prev) => [...prev, newUser]);
    setShowAddForm(false);
  };

  const handleSearch = (search: string) => {
    setTempSearch(search);
    fetchUsers(search, 1);
  };

  const handlePageChange = (page: number) => {
    fetchUsers(tempSearch, page);
  };

  // Inside the return statement of Users component
  return (
    <div>
      <div className="flex gap-5 flex-row justify-between items-center">
        <div className="flex items-center">
        <ComponentName name="Users" />
        <ButtonComponent
            label="Add User"
            type={ButtonType.Primary} // Adjust the type as per your ButtonComponent
            onClick={() => setShowAddForm(true)}
          />
        </div>  
        <div className="flex gap-5 flex-row p-5 items-center">
          <Search handleSubmit={handleSearch} />
          <ExportButton
            paginationData={paginationData}
            tempSearch={tempSearch}
          />
          {/* <Switch
            editMode={editMode}
            handleSwitch={() => setEditMode((prev) => !prev)}
          /> */}
          {/* Add the "Add User" button here */}
          
        </div>
      </div>

      <UserTable
        users={users}
        error={error}
        loading={loading}
        paginationData={paginationData}
        onPageChange={handlePageChange}
        editMode={true} // Ensure editMode is correctly passed
        onUserUpdated={() => fetchUsers(tempSearch, 1)}
      />

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Add New User</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddForm(false)}
              >
                &times;
              </button>
            </div>
            <AddUserForm onAdd={handleAddUser} />
          </div>
        </div>
      )}
    </div>
  );
};
