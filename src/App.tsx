import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import "./index.css";
import { Home } from "./views/Home";
import Workers from "./views/Workers";
import { Login } from "./views/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPage from "./views/Admin";

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
          </Route>
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
