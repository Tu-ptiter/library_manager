// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ChangePassword from '@/components/password/ChangePassword';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      const parsedData = JSON.parse(adminData);
      setUserName(parsedData.name);
    }
  }, []);

  // Update date time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const day = days[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const sec = String(date.getSeconds()).padStart(2, '0');

    return `${day}, ${dd}/${mm}/${yyyy} ${hh}:${min}:${sec}`;
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex justify-between items-center h-16 shadow-md">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="text-white lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <span className="text-white text-2xl font-semibold tracking-wide hover:text-blue-400 transition-colors duration-200 font-sans">
          Admin Dashboard
        </span>
      </div>

      <div className="hidden md:block text-white text-sm font-medium">
        {formatDateTime(currentDateTime)}
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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 top-12 transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-top-right z-50">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            Đổi mật khẩu
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
