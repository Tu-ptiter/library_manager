import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/header';
import PageLayout from './layout/pages/user/page_layout';

const UserApp: React.FC = () => {
  return (
    
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/category/:categoryName" element={<PageLayout />} />
        <Route path="/category/:categoryName/:subcategoryName" element={<PageLayout />} />
      </Routes>
    </Router>
  );
};

export default UserApp;