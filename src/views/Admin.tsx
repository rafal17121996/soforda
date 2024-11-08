import React from "react";
import { AdminTopMenu } from "../components/Admin/AdminTopMenu";
import AdminLayout from "../components/Layout/AdminLayout";
import { Users } from "../components/Admin/Users";
import LastLogins from "../components/Admin/LastLogins";
import UsersWithTemporaryPassword from "../components/Admin/UsersWithTemporaryPassword";

const AdminPage: React.FC = () => {
  return (
    <div className="flex flex-col grow">
      <AdminTopMenu />
      <AdminLayout>
        <Users />
        <LastLogins />
        <UsersWithTemporaryPassword />
      </AdminLayout>
    </div>
  );
};

export default AdminPage;
