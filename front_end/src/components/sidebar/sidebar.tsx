// sidebar.tsx
import React from 'react';
import { FaBook, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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
  const location = useLocation();

  const menus: MenuItem[] = [
    {
      title: 'Sách',
      icon: <FaBook className="h-4 w-4" />,
      subItems: [
        { title: 'Tất cả Sách', path: '/admin/books/list' },
        { title: 'Thêm Sách', path: '/admin/books/add' },
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
  ];

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-gray-800 text-white overflow-hidden">
      <div className="flex flex-col h-full">
      <div className="p-4 text-2xl font-bold">Admin Dashboard</div>
      <Accordion type="single" collapsible className="mt-6">
        {menus.map((menu) => (
          <AccordionItem 
            key={menu.title} 
            value={menu.title}
            className="border-none"
          >
            <AccordionTrigger className="flex items-center px-4 py-3 hover:bg-gray-700 no-underline">
              <div className="flex items-center gap-3">
                {menu.icon}
                <span>{menu.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="ml-8 py-2 space-y-1">
                {menu.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    to={subItem.path}
                    className={`block px-4 py-2 rounded-md transition-colors
                      ${location.pathname === subItem.path 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      </div>
    </div>
  );
};

export default Sidebar;