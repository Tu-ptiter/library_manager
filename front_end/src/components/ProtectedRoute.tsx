import React from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('adminData');
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};


export default ProtectedRoute;