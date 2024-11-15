// book_table.tsx
import React from 'react';
import { Plus, Search, Edit, Trash2, RotateCcw } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EditBookModal from '../../../../components/EditBookModal/EditBookModal';
import DeleteConfirmDialog from '../../../../components/DeleteConfirmDialog/DeleteConfirmDialog';
import { Book, updateBook, deleteBook, searchBooks } from '@/api/api';
import { cn } from "@/lib/utils";
import CustomPagination from '../../../../components/custom-pagination';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface BookTableProps {
  currentItems: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (results: Book[] | null) => void;
}

type SearchType = 'title' | 'author';

const BookTable: React.FC<BookTableProps> = ({
  currentItems,
  currentPage,
  totalPages,
  onPageChange,
  onSearch
}) => {
  const navigate = useNavigate();
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = React.useState<Book | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchType, setSearchType] = React.useState<SearchType>('title');

  const handleResetSearch = () => {
    setSearchTerm('');
    onSearch(null);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      onSearch(null);
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchBooks(searchTerm, searchType); // Pass both searchTerm and searchType
      onSearch(results);
    } catch (error) {
      console.error('Error searching books:', error);
      onSearch(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchType(value);
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = (book: Book) => {
    setDeletingBook(book);
  };

  const handleSaveEdit = async (bookData: Partial<Book>) => {
    try {
      setIsLoading(true);
      if (!editingBook?.bookId) {
        console.error('Book ID is missing');
        return;
      }
      await updateBook(editingBook.bookId, bookData);
      setEditingBook(null);
      window.location.reload();
    } catch (error) {
      console.error('Error updating book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      if (!deletingBook?.bookId) {
        console.error('Book ID is missing');
        return;
      }
      await deleteBook(deletingBook.bookId);
      setDeletingBook(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentItems?.length && !isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Tất cả sách</h2>
        <div className="text-center py-8 space-y-4">
          <p className="text-gray-500">Không tìm thấy sách nào</p>
          <Button
            onClick={handleResetSearch}
            variant="outline"
            className="mx-auto"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Quay lại danh sách chính
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tất cả sách</h2>
      <div className="mb-6 flex justify-between items-center">
        <div className="relative flex gap-2 items-center w-[600px]">
          <Select value={searchType} onValueChange={handleSearchTypeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tìm kiếm theo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Tên sách</SelectItem>
              <SelectItem value="author">Tác giả</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              placeholder={searchType === 'title' ? "Tìm kiếm theo tên sách..." : "Tìm kiếm theo tác giả..."}
              className="pl-8 focus:ring-0 focus:ring-offset-0"
            />
          </div>
          <Button 
            onClick={handleSearch}
            variant="outline"
          >
            Tìm kiếm
          </Button>
        </div>
        <Button 
          onClick={() => navigate('/admin/books/add')}
          className="bg-green-500 hover:bg-blue-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sách mới
        </Button>
      </div>
      <div className="overflow-x-auto rounded-md border border-gray-200 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-medium text-gray-700">ID</TableHead>
              <TableHead className="font-medium text-gray-700">Hình ảnh</TableHead>
              <TableHead className="font-medium text-gray-700">Tên</TableHead>
              <TableHead className="font-medium text-gray-700">Danh mục nhỏ</TableHead>
              <TableHead className="font-medium text-gray-700">Tác giả</TableHead>
              <TableHead className="font-medium text-gray-700">Năm xuất bản</TableHead>
              <TableHead className="font-medium text-gray-700">Số lượng</TableHead>
              <TableHead className="font-medium text-gray-700">Trạng thái</TableHead>
              <TableHead className="font-medium text-right text-gray-700">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((book) => (
              <TableRow key={`book-${book.bookId}`} className="bg-gray-50/50 hover:bg-gray-100/80 border-gray-200">
                <TableCell className="font-medium">{book.bookId}</TableCell>
                <TableCell>
                  <img 
                    src={book.img} 
                    alt={book.title} 
                    className="w-16 h-16 object-cover rounded-sm"
                  />
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{book.title}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {book.bigCategory?.map((cat, index) => (
                    <span key={`${book.bookId}-${cat.name}-${index}`}>
                      {cat.smallCategory?.join(', ')}
                      {index < book.bigCategory.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {book.author?.join(', ') || 'N/A'}
                </TableCell>
                <TableCell>{book.publicationYear}</TableCell>
                <TableCell>{book.quantity}</TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    book.availability ? 
                      "bg-green-100 text-green-800" : 
                      "bg-red-100 text-red-800"
                  )}>
                    {book.availability ? 'Còn sách' : 'Hết sách'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(book)}
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
      <EditBookModal
        book={editingBook}
        isOpen={!!editingBook}
        onClose={() => setEditingBook(null)}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmDialog
        isOpen={!!deletingBook}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleConfirmDelete}
        bookName={deletingBook?.title || ''}
      />
    </div>
  );
};

export default BookTable;