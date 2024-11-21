// reader_table.tsx
import React, { useState, useMemo } from 'react';
import { Search, Plus } from "lucide-react";
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
import { Edit, Trash2 } from "lucide-react";
import EditMemberModal from '../../../../components/EditMembersModal/EditMembersModal';
import DeleteConfirmDialog from '../../../../components/DeleteConfirmDialog/DeleteConfirmDialog';
import { Member, updateMember, deleteMember } from '@/api/api';
import { cn } from "@/lib/utils";
import CustomPagination from '../../../../components/custom-pagination';

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
  const itemsPerPage = 10;

  // Keep existing handlers...

  const handleEdit = (member: Member) => {
    setEditingMember(member);
  };

  const handleDelete = (member: Member) => {
    setDeletingMember(member);
  };

  const handleSaveEdit = async (memberData: Partial<Member>) => {
    try {
      if (!editingMember?.memberId) {
        console.error('Member ID is missing');
        return;
      }
   
      await updateMember(editingMember.memberId, memberData);
      setEditingMember(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };
  
  const handleConfirmDelete = async () => {
    try {
      if (!deletingMember?.memberId) {
        console.error('Member ID is missing');
        return;
      }
      
      await deleteMember(deletingMember.memberId);
      setDeletingMember(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  // Keep existing filtering and sorting logic...
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
                      {/* Show email on mobile */}
                      <p className="text-sm text-gray-500 md:hidden">
                        {member.email}
                      </p>
                      {/* Show phone on mobile */}
                      <p className="text-sm text-gray-500 sm:hidden">
                        {member.phoneNumber}
                      </p>
                      {/* Show address on mobile */}
                      <p className="text-sm text-gray-500 lg:hidden max-w-[200px] truncate">
                        {member.address}
                      </p>
                      {/* Show borrowed books on mobile */}
                      <div className="flex items-center gap-2 sm:hidden mt-2">
                        <span className="text-sm text-gray-500">
                          Sách mượn: {member.booksBorrowed}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{member.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{member.phoneNumber}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px] truncate">
                    {member.address}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {member.booksBorrowed}
                  </TableCell>
                  <TableCell className="text-right space-x-1 pr-4">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
  
      {/* Pagination */}
      <div className="mt-4 sm:mt-6 flex justify-center">
        <CustomPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
  
      {/* Modals */}
      <EditMemberModal
        member={editingMember}
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSave={handleSaveEdit}
      />
      
      <DeleteConfirmDialog
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleConfirmDelete}
        bookName={deletingMember?.name || ''}
      />
    </div>
  );
};

export default ReaderTable;