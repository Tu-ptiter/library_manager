// EditMembersModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Member } from '@/api/api';

interface EditMemberModalProps {
  member: Member | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: Partial<Member>) => Promise<void>;
}

const initialFormData: Partial<Member> = {
  name: '',
  email: '',
  phoneNumber: '',
  address: '',
  transactions: [],
  booksBorrowed: 0
};

const EditMemberModal: React.FC<EditMemberModalProps> = ({ 
  member, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [formData, setFormData] = React.useState<Partial<Member>>(initialFormData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        id: member.id,
        memberId: member.memberId,
        transactions: member.transactions,
        booksBorrowed: member.booksBorrowed
      });
      setErrors({});
    } else {
      setFormData(initialFormData);
    }
  }, [member]);

  const handleBorrowedBooksChange = (value: string) => {
    const number = parseInt(value);
    setFormData({
      ...formData,
      booksBorrowed: isNaN(number) ? 0 : number
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Họ và tên không được để trống';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }
  
    // Move this check before the return statement
    if (formData.booksBorrowed !== undefined && formData.booksBorrowed < 0) {
      newErrors.booksBorrowed = 'Số sách mượn không được âm';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updatedData = {
        ...formData,
        id: member?.id,
        memberId: member?.memberId,
        transactions: member?.transactions || [],
        booksBorrowed: formData.booksBorrowed || 0
      };
      
      await onSave(updatedData);
      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người đọc</DialogTitle>
          <DialogDescription>
          Chỉnh sửa thông tin người đọc. Nhấn lưu để cập nhật thay đổi.
        </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="memberId">Mã người đọc</Label>
            <Input
              id="memberId"
              value={formData.memberId || ''}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && (
                <span className="text-sm text-red-500">{errors.phoneNumber}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <span className="text-sm text-red-500">{errors.address}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="booksBorrowed">Số sách đang mượn</Label>
              <Input
                id="booksBorrowed"
                type="number"
                min="0"
                value={formData.booksBorrowed || 0}
                onChange={(e) => handleBorrowedBooksChange(e.target.value)}
                className={errors.booksBorrowed ? 'border-red-500' : ''}
                />
                {errors.booksBorrowed && (
                <span className="text-sm text-red-500">{errors.booksBorrowed}</span>
                )}
</div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">Lưu thay đổi</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberModal;