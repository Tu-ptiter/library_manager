// src/components/ReturnBookModal/ReturnBookModal.tsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Transaction, returnBook } from '@/api/api';
import { ArrowLeftRight } from 'lucide-react';

interface ReturnBookModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSuccess: () => void;
}

const ReturnBookModal: React.FC<ReturnBookModalProps> = ({
  transaction,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      await returnBook({
        transactionId: transaction.id,        // Add this
        memberId: transaction.memberId,       // Add this
        bookId: transaction.bookId,          // Add this
        name: transaction.memberName,
        title: transaction.bookTitle,
        phoneNumber: transaction.phoneNumber
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Có lỗi xảy ra khi trả sách');
      console.error('Error returning book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trả sách</DialogTitle>
          <DialogDescription>
            Xác nhận trả sách cho giao dịch này
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Người mượn</Label>
            <div className="text-sm">{transaction.memberName}</div>
          </div>
          <div className="grid gap-2">
            <Label>Số điện thoại</Label>
            <div className="text-sm">{transaction.phoneNumber}</div>
          </div>
          <div className="grid gap-2">
            <Label>Tên sách</Label>
            <div className="text-sm">{transaction.bookTitle}</div>
          </div>
          <div className="grid gap-2">
            <Label>Ngày mượn</Label>
            <div className="text-sm">
              {new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Đang xử lý...
              </>
            ) : (
              <>
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Xác nhận trả sách
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnBookModal;