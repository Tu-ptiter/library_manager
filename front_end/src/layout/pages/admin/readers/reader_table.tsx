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
  currentItems = [], // Add default empty array
}) => {
  const navigate = useNavigate();
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

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

  // Filter items based on search term
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

  // Sort filtered items
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

  // Calculate pagination
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Tất cả người đọc</h2>
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative w-[400px]">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
            className={cn(
              "pl-8",
              "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />
        </div>
        <div className="w-[200px]">
          <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
            <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Tên A-Z</SelectItem>
              <SelectItem value="name-desc">Tên Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => navigate('/admin/readers/add')}
          className="bg-green-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm người đọc mới
        </Button>
      </div>

      <div className="rounded-md border border-gray-200">
        <Table>
          {/* Rest of the table code remains the same */}
          <TableHeader>
            <TableRow className={cn("bg-slate-50 hover:bg-slate-50")}>
              <TableHead className="font-medium text-gray-700">ID</TableHead>
              <TableHead className="font-medium text-gray-700">Họ và tên</TableHead>
              <TableHead className="font-medium text-gray-700">Email</TableHead>
              <TableHead className="font-medium text-gray-700">Số điện thoại</TableHead>
              <TableHead className="font-medium text-gray-700">Địa chỉ</TableHead>
              <TableHead className="font-medium text-gray-700">Số sách mượn</TableHead>
              <TableHead className="font-medium text-right text-gray-700">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((member) => (
              // Table row content remains the same
              <TableRow 
                key={member.memberId} 
                className={cn("bg-gray-50/50 hover:bg-gray-100/80 border-gray-200")}
              >
                <TableCell className="font-medium">{member.memberId}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell className="max-w-[200px] truncate">{member.address}</TableCell>
                <TableCell>{member.booksBorrowed}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn("hover:bg-blue-50 hover:text-blue-600")}
                    onClick={() => handleEdit(member)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn("hover:bg-red-50 hover:text-red-600")}
                    onClick={() => handleDelete(member)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <CustomPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

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