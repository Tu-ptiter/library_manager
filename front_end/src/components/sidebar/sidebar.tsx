// components/sidebar/Sidebar.tsx
import React from 'react';
import { FaBook, FaUser, FaHome, FaExchangeAlt, FaPowerOff} from 'react-icons/fa';
import { LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MenuItem {
  title: string;
  icon: React.ReactElement;
  subItems?: SubMenuItem[];
  path?: string;
}

interface SubMenuItem {
  title: string;
  path: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menus: MenuItem[] = [
    {
      title: 'Tổng quan',
      icon: <FaHome className="h-4 w-4" />,
      path: '/admin/overview',
    },
    {
      title: 'Sách',
      icon: <FaBook className="h-4 w-4" />,
      subItems: [
        { title: 'Tất cả Sách', path: '/admin/books/list' },
        { title: 'Thêm Sách', path: '/admin/books/add' },
        { title: 'Quản lý Danh mục', path: '/admin/books/categories' },
      ],
    },
    {
      title: 'Người đọc',
      icon: <FaUser className="h-4 w-4" />,
      subItems: [
        { title: 'Tất cả Người đọc', path: '/admin/readers/list' },
        { title: 'Thêm Người đọc', path: '/admin/readers/add' },
      ],
    },
    {
      title: 'Mượn trả',
      icon: <FaExchangeAlt className="h-4 w-4" />,
      subItems: [
        { title: 'Quản lý mượn trả', path: '/admin/borrows/manage' },
        { title: 'Lịch sử mượn trả', path: '/admin/borrows/history' },
      ],
    },
  ];

  const renderDirectLink = (menu: MenuItem) => (
    <Link
      key={menu.title}
      to={menu.path!}
      className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors
        ${location.pathname === menu.path ? 'bg-gray-700' : ''}`}
      onClick={() => setIsOpen(false)}
    >
      {menu.icon}
      <span>{menu.title}</span>
    </Link>
  );

  const isSubItemActive = (subItems: SubMenuItem[]) => {
    return subItems.some(item => location.pathname === item.path);
  };

  const renderAccordionItems = (menuItems: MenuItem[]) => (
    menuItems.map((menu) => {
      const isActive = menu.subItems && isSubItemActive(menu.subItems);
      
      return (
        <AccordionItem 
          key={menu.title} 
          value={menu.title}
          className="border-none"
        >
          <AccordionTrigger 
            className={`flex items-center px-4 py-3 hover:bg-gray-700 no-underline transition-colors
              ${isActive ? 'bg-gray-700' : ''}`}
          >
            <div className="flex items-center gap-3">
              {menu.icon}
              <span>{menu.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="ml-8 py-2 space-y-1">
              {menu.subItems?.map((subItem) => (
                <Link
                  key={subItem.title}
                  to={subItem.path}
                  className={`block px-4 py-2 rounded-md transition-colors
                    ${location.pathname === subItem.path 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      );
    })
  );

  const directMenus = menus.filter(menu => menu.path);
  const dropdownMenus = menus.filter(menu => menu.subItems);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity lg:hidden
          ${isOpen ? 'opacity-100 z-30' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-16 bottom-0 left-0 w-64 bg-gray-800 text-white transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 z-40' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <div className="p-4 flex-1 overflow-y-auto">
            {directMenus.map(renderDirectLink)}
            <Accordion type="single" collapsible className="mt-2">
              {renderAccordionItems(dropdownMenus)}
            </Accordion>
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-700 my-4" />
  
          {/* Logout Button */}
          <div className="p-4">
            <button
              className="flex items-center gap-3 w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white transition-colors rounded-md"
              onClick={() => {
                localStorage.removeItem('adminData');
                window.location.href = '/admin/login';
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
