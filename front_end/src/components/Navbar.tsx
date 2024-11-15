import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <div className="text-white text-2xl">Admin Dashboard</div>
      <div className="relative">
        <img
          src="https://i.pinimg.com/564x/81/3f/47/813f470f121b1682fa04a2f4d78d7f25.jpg" // Thay thế bằng đường dẫn đến ảnh avatar của bạn
          alt="Avatar"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleMenu}
        />
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
            <button
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;