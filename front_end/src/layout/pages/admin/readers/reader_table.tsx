import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Info } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EditMemberModal from '../../../../components/EditMembersModal/EditMembersModal';
import DeleteConfirmDialog from '../../../../components/DeleteConfirmDialog/DeleteConfirmDialog';
import { Member, updateMember, deleteMember, fetchBorrowedAndRenewedBooks } from '@/api/api';
import { cn } from "@/lib/utils";
import CustomPagination from '../../../../components/custom-pagination';
import {toast, Toaster} from 'react-hot-toast';
import { set } from 'lodash';

type SortOption = 'name-asc' | 'name-desc';

interface ReaderTableProps {
  currentItems: Member[];
}

const ReaderTable: React.FC<ReaderTableProps> = ({
  currentItems = [],
}) => {
  const navigate = useNavigate();
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<any | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const itemsPerPage = 10;

  const handleEdit = (member: Member) => {
    setEditingMember(member);
  };

  const handleDelete = (member: Member) => {
    setDeletingMember(member);
  };

  const handleViewInfo = async (member: Member) => {
    try {
      const data = await fetchBorrowedAndRenewedBooks(member.memberId);
      setBorrowedBooks(data.borrowedAndRenewedBooks || []);
      setSelectedMember(member);
      setIsInfoModalOpen(true);
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const handleSaveEdit = async (memberData: Partial<Member>) => {
    try {
      if (!editingMember?.memberId) {
        toast.error('ID người đọc không tồn tại', {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
        return;
      }
      await updateMember(editingMember.memberId, memberData);
      toast.success('Cập nhật người đọc thành công', {
        duration: 3000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });
      setEditingMember(null);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (!deletingMember?.memberId) {
        toast.error('ID người đọc không tồn tại', {
          duration: 3000,
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        });
        return;
      }
      await deleteMember(deletingMember.memberId);
      toast.success('Xóa người đọc thành công', {
        duration: 3000,
        style: {
          background: '#22c55e',
          color: '#fff',
        },
      });
      setDeletingMember(null);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error('Đã xảy ra lỗi, vui lòng thử lại sau.', {
        duration: 3000,
        style: {
          background: '#ef4444',
          color: '#fff',
        },
      });
    }
  };

  const filteredItems = useMemo(() => {
    return currentItems.filter(member => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (member.name?.toLowerCase() || '').includes(searchLower) ||
        (member.email?.toLowerCase() || '').includes(searchLower) ||
        (member.phoneNumber || '').includes(searchTerm)
      );
    });
  }, [currentItems, searchTerm]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      if (!a.name || !b.name) return 0;
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [filteredItems, sortOption]);

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Tất cả người đọc</h2>
        <Button
          onClick={() => navigate('/admin/readers/add')}
          className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm người đọc mới
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
              <SelectTrigger className="h-11 w-full sm:w-[180px] border-gray-200 hover:border-gray-300">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Tên A-Z</SelectItem>
                <SelectItem value="name-desc">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                className="pl-10 h-11 text-base border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="-mx-4 sm:mx-0 rounded-none sm:rounded-lg border border-gray-200 overflow-hidden">
        <div className="relative overflow-x-auto min-h-[400px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80">
                <TableHead className="font-semibold text-gray-600">Họ và tên</TableHead>
                <TableHead className="font-semibold text-gray-600 hidden md:table-cell">Email</TableHead>
                <TableHead className="font-semibold text-gray-600 hidden sm:table-cell">Số điện thoại</TableHead>
                <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">Địa chỉ</TableHead>
                <TableHead className="font-semibold text-gray-600 hidden sm:table-cell text-center">Số sách mượn</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right pr-4">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((member) => (
                <TableRow
                  key={member.memberId}
                  className="transition-colors hover:bg-gray-50/80"
                >
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{member.phoneNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell">{member.address}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">{member.booksBorrowed}</TableCell>
                  <TableCell className="text-right space-x-1 flex justify-end items-center pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => handleEdit(member)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={() => handleDelete(member)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-gray-200 rounded-full transition-colors p-2 h-8 w-8 flex items-center justify-center",
                        member.booksBorrowed > 0
                          ? "hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-600"
                          : "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => handleViewInfo(member)}
                      disabled={member.booksBorrowed === 0}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Section */}
      <CustomPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Edit Member Modal */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          isOpen={!!editingMember}
          onSave={handleSaveEdit}
          onClose={() => setEditingMember(null)}
        />
      )}

      {/* Delete Confirm Dialog */}
      {deletingMember && (
        <DeleteConfirmDialog
          isOpen={!!deletingMember}
          bookName={deletingMember?.name || ''}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeletingMember(null)}
        />
      )}

      {/* Info Modal for Borrowed Books */}
  {isInfoModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 !m-0">
    {/* Modal container */}
    <div className="absolute inset-0 bg-black bg-opacity-50 m-0" onClick={() => setIsInfoModalOpen(false)}></div>
    <div className="relative z-10 bg-white rounded-lg shadow-md w-full max-w-2xl p-6">
      {/* Close button */}
      <button
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        onClick={() => setIsInfoModalOpen(false)}
      >
        <span className="sr-only">Đóng</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <h3 className="text-xl font-bold mb-4">Thông tin mượn sách</h3>
      
      {borrowedBooks ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <p><strong>Họ và tên:</strong> {selectedMember?.name}</p>
            <p><strong>Email:</strong> {selectedMember?.email}</p>
            <p><strong>Số điện thoại:</strong> {selectedMember?.phoneNumber}</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Danh sách sách:</h4>
            {/* Add custom scrollbar */}
            <div className="max-h-[400px] overflow-y-auto pr-4 
              scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
              hover:scrollbar-thumb-gray-400 scroll-smooth">
              <ul className="space-y-4">
                {borrowedBooks.map((book) => (
                  <li key={book.bookId} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <p><strong>Tiêu đề:</strong> {book.bookTitle}</p>
                    <p><strong>Loại giao dịch:</strong> {book.transactionType}</p>
                    <p><strong>Ngày giao dịch:</strong> {new Date(book.transactionDate).toLocaleString()}</p>
                    <p><strong>Hạn trả:</strong> {new Date(book.dueDate).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  </div>
)}
    </div>
    <Toaster position="top-right" />
    </>
  );
};

export default ReaderTable;
