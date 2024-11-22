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
import { Transaction, renewBook, fetchMembers } from '@/api/api';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface RenewBookModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSuccess: () => void;
}

const RenewBookModal: React.FC<RenewBookModalProps> = ({
  transaction,
  onClose,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = React.useState<string>('');
  const [response, setResponse] = React.useState<Transaction | null>(null);

  React.useEffect(() => {
    const fetchMemberPhone = async () => {
      try {
        const members = await fetchMembers();
        const member = members.find(m => m.name === transaction.memberName);
        if (member) {
          setPhoneNumber(member.phoneNumber);
        } else {
          setError('Không tìm thấy thông tin người mượn');
          toast.error('Không tìm thấy thông tin người mượn');
        }
      } catch (error) {
        console.error('Error fetching member phone:', error);
        setError('Không thể lấy thông tin người mượn');
        toast.error('Không thể lấy thông tin người mượn');
      }
    };
    fetchMemberPhone();
  }, [transaction.memberName]);

  const handleSubmit = async () => {
    if (!phoneNumber) {
      setError('Vui lòng chờ lấy thông tin số điện thoại');
      return;
    }

    try {
      setError(null);
      setIsSubmitting(true);
      setResponse(null);

      const result = await renewBook({
        transactionId: transaction.id,
        name: transaction.memberName,
        title: transaction.bookTitle,
        phoneNumber: phoneNumber
      });

      console.log('Renew response:', result);
      setResponse(result);

      if (result) {
        toast.success('Gia hạn sách thành công');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 3000); // Extended delay to show response
      } else {
        throw new Error('Không nhận được phản hồi từ server');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gia hạn sách';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error renewing book:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gia hạn sách</DialogTitle>
          <DialogDescription>
            Xác nhận gia hạn thời gian mượn sách cho giao dịch này
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Người mượn</Label>
            <div className="text-sm">{transaction.memberName}</div>
          </div>
          <div className="grid gap-2">
            <Label>Số điện thoại</Label>
            <div className="text-sm">{phoneNumber || 'Đang tải...'}</div>
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

          {/* Raw Response Data Display */}
          {response && (
            <div className="text-sm bg-gray-50 p-3 rounded-md space-y-2">
              <p className="font-medium text-gray-700">Server Response:</p>
              <pre className="whitespace-pre-wrap text-xs bg-white p-2 rounded border">
                {JSON.stringify(response, null, 2)}
              </pre>
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
            disabled={isSubmitting || !phoneNumber}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Đang xử lý...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Xác nhận gia hạn
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenewBookModal;