import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChangePassword from '@/components/password/ChangePassword';

const Navbar: React.FC = () => {
  const [userName, setUserName] = React.useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      const parsedData = JSON.parse(adminData);
      setUserName(parsedData.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex justify-between items-center fixed top-0 left-0 h-12 w-full z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <span className="text-white text-2xl font-semibold tracking-wide hover:text-blue-400 transition-colors duration-200 font-sans">
          Admin Dashboard
        </span>
      </div>
      <div className="relative group flex items-center">
        {userName && (
          <span className="text-gray-200 mr-4 text-lg font-medium tracking-wide hover:text-blue-400 transition-colors duration-200 cursor-pointer">
            {userName}
          </span>
        )}
        <img
          src="https://i.pinimg.com/564x/81/3f/47/813f470f121b1682fa04a2f4d78d7f25.jpg"
          alt="Avatar"
          className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent group-hover:border-blue-400 transition-all duration-200 shadow-sm group-hover:shadow-md"
        />
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 top-12 transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-top-right">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium border-b border-gray-100"
          >
            Đổi mật khẩu
          </button>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePassword onClose={() => setShowPasswordModal(false)} />
      )}

    </nav>
  );
};

export default Navbar;