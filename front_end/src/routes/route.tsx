import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../components/header/header';
import PageLayout from '../layout/pages/user/page_layout';
import AdminRoutes from './admin_route';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/category/:categoryName" element={<PageLayout />} />
        <Route path="/category/:categoryName/:subcategoryName" element={<PageLayout />} />
        <Route path="/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;