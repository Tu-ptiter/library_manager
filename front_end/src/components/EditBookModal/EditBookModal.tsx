// components/edit-book-modal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface Book {
    idBook: string;
    name: string;
    description: string;
    author: string[];
    publicationYear: number;
    bigCategory: Array<{
      name: string;
      smallCategory: string[];
    }>;
    quantity: number;
    availability: boolean;
    img: string;
    nxb: string;
    id: string;
}

interface EditBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: Partial<Book>) => Promise<void>;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState<Partial<Book>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        bigCategoryName: book.bigCategory?.[0]?.name || '',
        smallCategoryName: book.bigCategory?.[0]?.smallCategory?.[0] || ''
      });
    }
  }, [book]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.quantity && formData.quantity < 0) {
      newErrors.quantity = 'Số lượng không được âm';
    }

    if (formData.publicationYear && formData.publicationYear < 0) {
      newErrors.publicationYear = 'Năm xuất bản không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value) || 0; // Handle NaN case
    setFormData({ 
      ...formData, 
      quantity: quantity,
      availability: quantity > 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      bigCategory: [{
        name: formData.bigCategoryName as string,
        smallCategory: [formData.smallCategoryName as string]
      }]
    };

    delete submissionData.bigCategoryName;
    delete submissionData.smallCategoryName;

    await onSave(submissionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa sách</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên sách</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="idBook">Mã sách</Label>
              <Input
                id="idBook"
                value={formData.idBook || ''}
                onChange={(e) => setFormData({ ...formData, idBook: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">Tác giả</Label>
              <Input
                id="author"
                value={formData.author?.join(', ') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  author: e.target.value.split(',').map(a => a.trim()) 
                })}
                placeholder="Ngăn cách bởi dấu phẩy"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publicationYear">Năm xuất bản</Label>
              <Input
                id="publicationYear"
                type="number"
                min="0"
                value={formData.publicationYear || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  publicationYear: parseInt(e.target.value) 
                })}
                className={errors.publicationYear ? 'border-red-500' : ''}
              />
              {errors.publicationYear && (
                <span className="text-sm text-red-500">{errors.publicationYear}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bigCategory">Danh mục lớn</Label>
              <Input
                id="bigCategory"
                value={formData.bigCategoryName || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  bigCategoryName: e.target.value 
                })}
                placeholder="Nhập tên danh mục lớn..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smallCategory">Danh mục nhỏ</Label>
              <Input
                id="smallCategory"
                value={formData.smallCategoryName || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  smallCategoryName: e.target.value 
                })}
                placeholder="Nhập tên danh mục nhỏ..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity !== undefined ? formData.quantity : ''}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className={errors.quantity ? 'border-red-500' : ''}
              />
              {errors.quantity && (
                <span className="text-sm text-red-500">{errors.quantity}</span>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nxb">Nhà xuất bản</Label>
              <Input
                id="nxb"
                value={formData.nxb || ''}
                onChange={(e) => setFormData({ ...formData, nxb: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="img">Link hình ảnh</Label>
              <Input
                id="img"
                value={formData.img || ''}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
              />
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

export default EditBookModal;