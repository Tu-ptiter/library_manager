import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar/sidebar';
import { Outlet, useParams } from 'react-router-dom';
import { fetchBooks } from '../../../api/api';

type EntityType = 'books' | 'readers';

interface Book {
  id: string;
  name: string;
  big_category: string;
  small_category: string;
  picture: string;
  author: string;
}

interface Reader {
  id: number;
  name: string;
}

const CrudLayout: React.FC = () => {
  const { entity, action, id } = useParams<{ entity: EntityType; action: string; id?: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(''); // State for input page number
  const itemsPerPage = 10;

  useEffect(() => {
    if (entity === 'books') {
      fetchBooks().then(setBooks).catch(console.error);
    }
  }, [entity]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = books.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderContent = () => {
    if (!entity || (entity === 'books' && !books.length)) {
      return <div>Hành động không hợp lệ hoặc không có dữ liệu</div>;
    }

    switch (action) {
      case 'list':
        return (
          <div>
            <h2>Tất cả {entity}</h2>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2">ID</th>
                  <th className="py-2">Tên</th>
                  <th className="py-2">Danh mục lớn</th>
                  <th className="py-2">Danh mục nhỏ</th>
                  <th className="py-2">Tác giả</th>
                  <th className="py-2">Hình ảnh</th>
                  <th className="py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((book) => (
                  <tr key={book.id}>
                    <td className="border px-4 py-2">{book.id}</td>
                    <td className="border px-6 py-7 truncate max-w-xs">{book.name}</td>
                    <td className="border px-6 py-7 truncate max-w-xs">{book.big_category}</td>
                    <td className="border px-6 py-7 truncate max-w-xs">{book.small_category}</td>
                    <td className="border px-6 py-7 truncate max-w-xs">{book.author}</td>
                    <td className="border px-4 py-2">
                      <img src={book.picture} alt={book.name} className="w-16 h-16 object-cover" />
                    </td>
                    <td className="border px-4 py-2">
                      <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">Sửa</button>
                      <button className="bg-red-500 text-white px-2 py-1 rounded">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-center items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded mr-2 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded ml-2 disabled:opacity-50"
              >
                Next
              </button>
              <div className="ml-4 flex items-center">
                <input
                  type="number"
                  value={inputPage}
                  onChange={(e) => setInputPage(e.target.value)}
                  className="px-2 py-1 border rounded"
                  placeholder="Page"
                  min="1"
                  max={totalPages}
                />
                <button
                  onClick={handleGoToPage}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        );
      case 'add':
        return <div>Thêm {entity}</div>;
      case 'edit': {
        const item = books.find((book) => book.id === id);
        return item ? <div>Sửa {entity} {item.name}</div> : <div>Không tìm thấy {entity}</div>;
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
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export { AdminDashboardLayout, CrudLayout };