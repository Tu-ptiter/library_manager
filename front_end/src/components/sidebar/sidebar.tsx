import React, { useState } from 'react';
import { FaBook, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  subItems: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();

  const menus: MenuItem[] = [
    {
      title: 'Sách',
      icon: <FaBook />,
      subItems: [
        { title: 'Tất cả Sách', path: '/admin/books/list' },
        { title: 'Thêm Sách', path: '/admin/books/add' },
        { title: 'Sửa Sách', path: '/admin/books/edit' },
      ],
    },
    {
      title: 'Người đọc',
      icon: <FaUser />,
      subItems: [
        { title: 'Tất cả Người đọc', path: '/admin/readers/list' },
        { title: 'Thêm Người đọc', path: '/admin/readers/add' },
        { title: 'Sửa Người đọc', path: '/admin/readers/edit' },
      ],
    },
  ];

  const toggleMenu = (title: string) => {
    if (activeMenu === title) {
      setActiveMenu(null);
    } else {
      setActiveMenu(title);
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <div className="p-4 text-2xl font-bold">Admin Dashboard</div>
      <nav className="mt-10">
        {menus.map((menu) => (
          <div key={menu.title}>
            <button
              onClick={() => toggleMenu(menu.title)}
              className="w-full flex items-center p-4 hover:bg-gray-700 focus:outline-none"
            >
              <span className="mr-3">{menu.icon}</span>
              <span className="flex-1 text-left">{menu.title}</span>
              {activeMenu === menu.title ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {activeMenu === menu.title && (
              <div className="ml-8">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    to={subItem.path}
                    className={`block p-2 hover:bg-gray-700 rounded ${location.pathname === subItem.path ? 'bg-gray-700' : ''}`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;