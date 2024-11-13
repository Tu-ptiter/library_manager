import React from 'react';
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
import EditBookModal from '../../../../components/EditBookModal/EditBookModal';
import DeleteConfirmDialog from '../../../../components/DeleteConfirmDialog/DeleteConfirmDialog';
import { Book, updateBook, deleteBook } from '@/api/api';
import { cn } from "@/lib/utils";
import CustomPagination from '../../../../components/custom-pagination';
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner';

interface BookTableProps {
  currentItems: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchField: string;
  setSearchField: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

type SortOption = 'name-asc' | 'name-desc' | 'year-desc' | 'year-asc';

const BookTable: React.FC<BookTableProps> = ({
  currentItems,
  currentPage,
  totalPages,
  onPageChange,
  searchField,
  setSearchField,
  searchTerm,
  setSearchTerm
}) => {
  const navigate = useNavigate();
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = React.useState<Book | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sortOption, setSortOption] = React.useState<SortOption>('name-asc');

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = (book: Book) => {
    setDeletingBook(book);
  };

  const handleSaveEdit = async (bookData: Partial<Book>) => {
    try {
      setIsLoading(true);
      if (!editingBook?.idBook) {
        console.error('Book ID is missing');
        return;
      }
      await updateBook(editingBook.idBook, bookData);
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
      if (!deletingBook?.idBook) {
        console.error('Book ID is missing');
        return;
      }
      await deleteBook(deletingBook.idBook);
      setDeletingBook(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedItems = React.useMemo(() => {
    return [...currentItems].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'year-desc':
          return b.publicationYear - a.publicationYear;
        case 'year-asc':
          return a.publicationYear - b.publicationYear;
        default:
          return 0;
      }
    });
  }, [currentItems, sortOption]);

  const renderSearchBar = () => (
    <div className="mb-6 flex gap-4 sm:flex-row sm:items-center">
      <div className="w-full sm:w-[200px]">
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Chọn trường tìm kiếm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Tên sách</SelectItem>
            <SelectItem value="author">Tác giả</SelectItem>
            <SelectItem value="bigCategory">Danh mục</SelectItem>
            <SelectItem value="idBook">Mã sách</SelectItem>
            <SelectItem value="nxb">Nhà xuất bản</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-[400px]">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`Tìm kiếm ${
            searchField === 'name' ? 'tên sách' :
            searchField === 'author' ? 'tác giả' :
            searchField === 'bigCategory' ? 'danh mục' :
            searchField === 'idBook' ? 'mã sách' : 'nhà xuất bản'
          }...`}
          className="pl-8 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
          <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Sắp xếp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Tên sách A-Z</SelectItem>
            <SelectItem value="name-desc">Tên sách Z-A</SelectItem>
            <SelectItem value="year-desc">Năm xuất bản mới nhất</SelectItem>
            <SelectItem value="year-asc">Năm xuất bản cũ nhất</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={() => navigate('/admin/books/add')}
        className="bg-green-500 hover:bg-blue-600 text-white w-full sm:w-auto"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm sách mới
      </Button>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Tất cả sách</h2>
      {renderSearchBar()}
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
            {sortedItems.map((book) => (
              <TableRow key={book.idBook} className="bg-gray-50/50 hover:bg-gray-100/80 border-gray-200">
                <TableCell className="font-medium">{book.idBook}</TableCell>
                <TableCell>
                  <img 
                    src={book.img} 
                    alt={book.name} 
                    className="w-16 h-16 object-cover rounded-sm"
                  />
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{book.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {book.bigCategory.map(cat => cat.smallCategory.join(', ')).join(', ')}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {book.author.join(', ')}
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
        bookName={deletingBook?.name || ''}
      />
    </div>
  );
};

export default BookTable;