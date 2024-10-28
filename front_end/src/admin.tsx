import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminDashboardLayout, CrudLayout } from './layout/pages/admin/admin_dashboard_layout';
import AdminDashboard from './layout/pages/admin/admin_dashboard';

const AdminApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path=":entity/:action" element={<CrudLayout />} />
          <Route path=":entity/:action/:id" element={<CrudLayout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AdminApp;