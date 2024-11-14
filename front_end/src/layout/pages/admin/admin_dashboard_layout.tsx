// admin_dashboard_layout.tsx
import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import Sidebar from '../../../components/sidebar/sidebar';
import BookTable from './books/book_table';
import ReaderTable from './readers/reader_table';
import { fetchBooks, fetchMembers } from '../../../api/api';
import type { Book, Member } from '../../../api/api';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import BorrowManagement from './borrows/borrow_management';
import CategoryManagement from './books/category_management';
import Navbar from '../../../components/Navbar';

type EntityType = 'books' | 'readers';

const CrudLayout: React.FC = () => {
  const { entity, action, id } = useParams<{ entity: EntityType; action: string; id?: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [originalBooks, setOriginalBooks] = useState<Book[]>([]); // Store original list
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const handleSearchResults = (results: Book[] | null) => {
    if (results === null) {
      // Reset to original list when search is cleared
      setBooks(originalBooks);
    } else {
      setBooks(results);
    }
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (entity === 'books') {
          const response = await fetchBooks(currentPage, itemsPerPage);
          const booksData = response.data || [];
          setBooks(booksData);
          setOriginalBooks(booksData); // Store original list
          setTotalPages(response.totalPages || 1);
        } else if (entity === 'readers') {
          const data = await fetchMembers();
          setMembers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setBooks([]);
        setOriginalBooks([]);
        setMembers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [entity, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      );
    }

    if (!entity) return <div>Hành động không hợp lệ</div>;

    switch (action) {
      case 'list':
        if (entity === 'books') {
          return (
            <BookTable
              currentItems={books}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onSearch={handleSearchResults}
            />
          );
        } else if (entity === 'readers') {
          if (!members?.length) return <div>Không có dữ liệu người đọc</div>;
          return (
            <ReaderTable
              currentItems={members}
              currentPage={currentPage}
              totalPages={Math.ceil(members.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          );
        }
        break;

      case 'manage':
        if (entity === 'borrows') {
          return <BorrowManagement />;
        }
        break;

      case 'categories':
        if (entity === 'books') {
          return <CategoryManagement />;
        }
        break;

      case 'add':
        return <div>Thêm {entity}</div>;

      case 'edit': {
        if (entity === 'books') {
          const item = books.find((book) => book.bookId === id);
          return item ? <div>Sửa {entity} {item.name}</div> : <div>Không tìm thấy {entity}</div>;
        } else if (entity === 'readers') {
          const item = members.find((member) => member.memberId === id);
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
      <h1 className="text-3xl font-bold mb-4"></h1>
      {renderContent()}
    </div>
  );
};

const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="pb-6">
        <Navbar />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 ml-64 p-4 lg:ml-64 md:ml-0 sm:ml-0 w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export { AdminDashboardLayout, CrudLayout };