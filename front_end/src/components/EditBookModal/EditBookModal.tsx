// components/edit-book-modal.tsx
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMainCategories, fetchSubCategories } from '@/api/api';

// Keep existing interfaces
export interface Book {
    idBook: string;
    title: string;
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

interface Category {
  mainCategory: string;
  subCategories: string[];
}

interface EditBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bookData: Partial<Book>) => Promise<void>;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, isOpen, onClose, onSave }) => {
  // Keep all existing state declarations and handlers the same
  const [formData, setFormData] = React.useState<Partial<Book>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = React.useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string>('');
  const [isLoadingCategories, setIsLoadingCategories] = React.useState(false);

  // Keep all useEffects and handlers the same
  React.useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const mainCategories = await fetchMainCategories();
        const categoriesWithSubs = await Promise.all(
          mainCategories.map(async (category) => {
            const subCategories = await fetchSubCategories(category);
            return {
              mainCategory: category,
              subCategories: subCategories.filter(Boolean)
            };
          })
        );
        setCategories(categoriesWithSubs.filter(cat => cat.mainCategory && cat.subCategories.length > 0));
        
        if (book?.bigCategory?.[0]) {
          const mainCat = book.bigCategory[0].name;
          const subCat = book.bigCategory[0].smallCategory?.[0];
          setSelectedMainCategory(mainCat);
          setSelectedSubCategory(subCat);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, book]);

  React.useEffect(() => {
    if (book) {
      setFormData({
        ...book,
        description: book.description || '',
        nxb: book.nxb || '',
        img: book.img || '',
      });
    }
  }, [book]);

  // Keep all handlers
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedMainCategory) {
      newErrors.bigCategory = 'Danh mục lớn không được để trống';
    }

    if (!selectedSubCategory) {
      newErrors.smallCategory = 'Danh mục nhỏ không được để trống';
    }

    if (formData.quantity !== undefined && formData.quantity < 0) {
      newErrors.quantity = 'Số lượng không được âm';
    }

    if (formData.publicationYear !== undefined && formData.publicationYear < 0) {
      newErrors.publicationYear = 'Năm xuất bản không được âm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value) || 0;
    setFormData({ 
      ...formData, 
      quantity: quantity,
      availability: quantity > 0
    });
  };

  const handleMainCategoryChange = (value: string) => {
    setSelectedMainCategory(value);
    const category = categories.find(c => c.mainCategory === value);
    if (category) {
      setSelectedSubCategory(category.subCategories[0] || '');
      setFormData(prev => ({
        ...prev,
        bigCategory: [{
          name: value,
          smallCategory: [category.subCategories[0] || '']
        }]
      }));
    }
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategory(value);
    setFormData(prev => ({
      ...prev,
      bigCategory: [{
        name: selectedMainCategory,
        smallCategory: [value]
      }]
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const submissionData = {
      ...formData,
      bigCategory: [{
        name: selectedMainCategory,
        smallCategory: [selectedSubCategory]
      }]
    };

    await onSave(submissionData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[625px] h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
          <DialogTitle>Chỉnh sửa sách</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin sách. Nhấn lưu để cập nhật thay đổi.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* All form fields go here - keeping the same structure */}
                <div className="space-y-2">
                  <Label htmlFor="name">Tên sách</Label>
                  <Input
                    id="name"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idBook">Mã sách</Label>
                  <Input
                    id="idBook"
                    value={formData.bookId || ''}
                    readOnly
                    className="bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="author">Tác giả</Label>
                  <Input
                    id="author"
                    value={formData.author?.join(', ') || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      author: e.target.value.split(',').map(a => a.trim()).filter(Boolean)
                    })}
                    placeholder="Ngăn cách bởi dấu phẩy"
                    className="bg-slate-100"
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
                      publicationYear: parseInt(e.target.value) || 0
                    })}
                    className={errors.publicationYear ? 'border-red-500 bg-slate-100' : 'bg-slate-100'}
                    
                  />
                  {errors.publicationYear && (
                    <span className="text-sm text-red-500">{errors.publicationYear}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bigCategory">Danh mục lớn</Label>
                  <Select 
                    value={selectedMainCategory}
                    onValueChange={handleMainCategoryChange}
                  >
                    <SelectTrigger id="bigCategory" className="bg-slate-100">
                      <SelectValue placeholder="Chọn danh mục lớn" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem 
                          key={category.mainCategory} 
                          value={category.mainCategory}
                        >
                          {category.mainCategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bigCategory && (
                    <span className="text-sm text-red-500">{errors.bigCategory}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smallCategory">Danh mục nhỏ</Label>
                  <Select 
                    value={selectedSubCategory}
                    onValueChange={handleSubCategoryChange}
                    disabled={!selectedMainCategory}
                  >
                    <SelectTrigger id="smallCategory" className="bg-slate-100">
                      <SelectValue placeholder="Chọn danh mục nhỏ" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find(c => c.mainCategory === selectedMainCategory)
                        ?.subCategories
                        .map(sub => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.smallCategory && (
                    <span className="text-sm text-red-500">{errors.smallCategory}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity !== undefined ? formData.quantity : ''}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className={errors.quantity ? 'border-red-500' : 'bg-slate-100'}
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
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-slate-100"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="img">Link hình ảnh</Label>
                  <Input
                    id="img"
                    value={formData.img || ''}
                    onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                    className="bg-slate-100"
                  />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookModal;