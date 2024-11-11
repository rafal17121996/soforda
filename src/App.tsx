import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import "./index.css";
import { Home } from "./views/Home";
import Workers from "./views/Workers";
import { Login } from "./views/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./views/Admin";
import Roles from "./views/Roles";
import Companies from "./views/Companies";
import Departments from "./views/Departments";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker" element={<Workers />} />
          <Route path="/login" element={<Login />} />
          //Admin only
          <Route element={<ProtectedRoute roles={["admin"]} />}>
            <Route path="/admin/users" element={<AdminPage />} />
            <Route path="/admin/roles" element={<Roles />} />
            <Route path="/admin/companies" element={<Companies />} />
            <Route path="/admin/departments" element={<Departments />} />
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
