import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminDashboardLayout, CrudLayout } from '../layout/pages/admin/admin_dashboard_layout';
import AdminDashboard from '../layout/pages/admin/admin_dashboard';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboardLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path=":entity/:action" element={<CrudLayout />} />
        <Route path=":entity/:action/:id" element={<CrudLayout />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;