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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Pass the required data structure
      await returnBook({
        name: transaction.memberName,
        title: transaction.bookTitle
      });
      onSuccess();
    } catch (error) {
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
            <Label>Tên sách</Label>
            <div className="text-sm">{transaction.bookTitle}</div>
          </div>
          <div className="grid gap-2">
            <Label>Ngày mượn</Label>
            <div className="text-sm">
              {new Date(transaction.transactionDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Xác nhận trả sách
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnBookModal;