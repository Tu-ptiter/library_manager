// reader_table.tsx
import React from 'react';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import EditMemberModal from '../../../components/EditMembersModal/EditMembersModal';
import DeleteConfirmDialog from '../../../components/DeleteConfirmDialog/DeleteConfirmDialog';
import { Member, updateMember, deleteMember } from '@/api/api';
import { cn } from "@/lib/utils";
import CustomPagination from '../../../components/custom-pagination';

interface ReaderTableProps {
  currentItems: Member[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const ReaderTable: React.FC<ReaderTableProps> = ({
  currentItems,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  setSearchTerm
}) => {
  const [editingMember, setEditingMember] = React.useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = React.useState<Member | null>(null);

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
      
      try {
        await deleteMember(deletingMember.memberId);
        setDeletingMember(null);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    } catch (error) {
      console.error('Error in delete handler:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tất cả người đọc</h2>
      <div className="mb-6 flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm người đọc..."
            className={cn(
              "pl-8",
              "focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />
        </div>
      </div>
      <div className="rounded-md border border-gray-200">
        <Table>
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
            {currentItems.map((member) => (
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
          onPageChange={onPageChange}
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