import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;