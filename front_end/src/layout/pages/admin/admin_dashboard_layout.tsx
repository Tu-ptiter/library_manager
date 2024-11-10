// admin_dashboard_layout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from '../../../components/sidebar/sidebar';
import BookTable from './book_table';
import ReaderTable from './reader_table';
import { fetchBooks, fetchMembers } from '../../../api/api';
import type { Book, Member } from '../../../api/api';

type EntityType = 'books' | 'readers';
type SearchField = 'name' | 'author' | 'bigCategory' | 'idBook' | 'nxb';

const CrudLayout: React.FC = () => {
  const { entity, action, id } = useParams<{ entity: EntityType; action: string; id?: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState<SearchField>('name');
  const itemsPerPage = 10;

  useEffect(() => {
    if (entity === 'books') {
      fetchBooks().then(setBooks).catch(console.error);
    } else if (entity === 'readers') {
      fetchMembers().then(setMembers).catch(console.error);
    }
  }, [entity]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchField]);

  // Filter books
  const filteredBooks = books.filter((book) => {
    const term = searchTerm.toLowerCase();
    switch (searchField) {
      case 'name':
        return book.name.toLowerCase().includes(term);
      case 'author':
        return book.author.some(author => author.toLowerCase().includes(term));
      case 'bigCategory':
        return book.bigCategory.some(cat => cat.name.toLowerCase().includes(term));
      case 'idBook':
        return book.idBook.toLowerCase().includes(term);
      case 'nxb':
        return book.nxb.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  // Filter members
  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term) ||
      member.phoneNumber.includes(term)
    );
  });

  // Calculate pagination for current entity
  const currentData = entity === 'books' ? filteredBooks : filteredMembers;
  const totalPages = Math.max(1, Math.ceil(currentData.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentData.length, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = currentData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderContent = () => {
    if (!entity) return <div>Hành động không hợp lệ</div>;

    switch (action) {
      case 'list':
        if (entity === 'books') {
          if (!books.length) return <div>Không có dữ liệu sách</div>;
          return (
            <BookTable
              currentItems={currentItems as Book[]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              searchField={searchField}
              setSearchField={setSearchField}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          );
        } else if (entity === 'readers') {
          if (!members.length) return <div>Không có dữ liệu người đọc</div>;
          return (
            <ReaderTable
              currentItems={currentItems as Member[]}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          );
        }
        break;
      case 'add':
        return <div>Thêm {entity}</div>;
      case 'edit': {
        if (entity === 'books') {
          const item = books.find((book) => book.id === id);
          return item ? <div>Sửa {entity} {item.name}</div> : <div>Không tìm thấy {entity}</div>;
        } else if (entity === 'readers') {
          const item = members.find((member) => member.id === id);
          return item ? <div>Sửa {entity} {item.name}</div> : <div>Không tìm thấy {entity}</div>;
        }
        return <div>Sửa {entity}</div>;
      }
      default:
        return <div>Hành động không hợp lệ</div>;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{entity} - {action}</h1>
      {renderContent()}
    </div>
  );
};

const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export { AdminDashboardLayout, CrudLayout };