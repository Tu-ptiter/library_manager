import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminDashboardLayout, CrudLayout } from '../layout/pages/admin/admin_dashboard_layout';
import AdminDashboard from '../layout/pages/admin/admin_dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
const isAuthenticated = true; // Thay thế bằng logic xác thực thực tế
const isAdmin = true; // Thay thế bằng logic kiểm tra quyền quản trị thực tế

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            element={<AdminDashboardLayout />}
          />
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path=":entity/:action" element={<CrudLayout />} />
        <Route path=":entity/:action/:id" element={<CrudLayout />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;