import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboardLayout, CrudLayout } from './layout/pages/admin/admin_dashboard_layout';
import AdminDashboard from './layout/pages/admin/admin_dashboard';
import Overview from './layout/pages/admin/overview/overview';
import AddBook from './layout/pages/admin/books/add_book';
import AddReader from './layout/pages/admin/readers/add_reader';
import BorrowManagement from './layout/pages/admin/borrows/borrow_management';
import BorrowHistory from './layout/pages/admin/borrows/borrow_history';
import CategoryManagement from './layout/pages/admin/books/category_management';

import Login from './layout/pages/admin/login/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './layout/pages/admin/login/ForgotPassword';


const AdminApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin/login/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/overview" replace />} />

          <Route path="overview" element={<Overview />} />
          <Route path=":entity/:action" element={<CrudLayout />} />
          <Route path=":entity/:action/:id" element={<CrudLayout />} />
          <Route path="books/add" element={<AddBook />} />
          <Route path="books/categories" element={<CategoryManagement />} />
          <Route path="readers/add" element={<AddReader />} />
          <Route path="borrows/history" element={<BorrowHistory />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AdminApp;