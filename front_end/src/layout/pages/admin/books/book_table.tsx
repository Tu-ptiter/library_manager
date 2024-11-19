// book_table.tsx
import React from 'react';
import { Plus, Search, Edit, Trash2, RotateCcw, Filter } from "lucide-react";
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
import { 
  Book, 
  updateBook, 
  deleteBook, 
  searchBooks, 
  fetchMainCategories, 
  fetchSubCategories,
  fetchBooksByCategory 
} from '@/api/api';
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
  const [categories, setCategories] = React.useState<{mainCategory: string, subCategories: string[]}[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = React.useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string>('');
  const [filteredBooks, setFilteredBooks] = React.useState<Book[] | null>(null);
  const [filterCurrentPage, setFilterCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const paginatedFilteredBooks = React.useMemo(() => {
    if (!filteredBooks) return null;
    const start = (filterCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredBooks.slice(start, end);
  }, [filteredBooks, filterCurrentPage]);

  const filteredTotalPages = React.useMemo(() => {
    if (!filteredBooks) return 0;
    return Math.ceil(filteredBooks.length / itemsPerPage);
  }, [filteredBooks]);

  const handleResetSearch = () => {
    setSearchTerm('');
    setFilteredBooks(null);
    setFilterCurrentPage(1);
    setSelectedMainCategory('');
    setSelectedSubCategory('');
    onSearch(null);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      handleResetSearch();
      return;
    }
    setIsLoading(true);
    try {
      const results = await searchBooks(searchTerm, searchType);
      setFilteredBooks(results);
      setFilterCurrentPage(1);
      onSearch(results);
    } catch (error) {
      console.error('Error searching books:', error);
      handleResetSearch();
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async () => {
    if (!selectedMainCategory || !selectedSubCategory) return;
    
    setIsLoading(true);
    try {
      const results = await fetchBooksByCategory(selectedMainCategory, selectedSubCategory);
      setFilteredBooks(results);
      setFilterCurrentPage(1);
      onSearch(results);
    } catch (error) {
      console.error('Error filtering books:', error);
      handleResetSearch();
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (filteredBooks) {
      setFilterCurrentPage(page);
    } else {
      onPageChange(page);
    }
  };

  const displayItems = filteredBooks ? paginatedFilteredBooks : currentItems;
  const displayCurrentPage = filteredBooks ? filterCurrentPage : currentPage;
  const displayTotalPages = filteredBooks ? filteredTotalPages : totalPages;

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

  const handleMainCategoryChange = (value: string) => {
    setSelectedMainCategory(value);
    setSelectedSubCategory('');
  };

  const handleSubCategoryChange = (value: string) => {
    setSelectedSubCategory(value);
    
    if (!selectedMainCategory) {
      const category = categories.find(c => 
        c.subCategories.includes(value)
      );
      if (category) {
        setSelectedMainCategory(category.mainCategory);
      }
    }
  };
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const mainCategories = await fetchMainCategories();
        const categoriesWithSubs = await Promise.all(
          mainCategories.map(async (category) => ({
            mainCategory: category,
            subCategories: await fetchSubCategories(category)
          }))
        );
        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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

  if (!displayItems?.length && !isLoading) {
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
        <div className="relative flex gap-2 items-center w-[900px]">
          <Select value={searchType} onValueChange={handleSearchTypeChange}>
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
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
              className="pl-8 focus:ring-0 focus:ring-offset-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button 
            onClick={handleSearch}
            variant="outline"
            className="font-normal border-blue-400 text-blue-400 hover:bg-blue-50 border"
          >
            Tìm kiếm
          </Button>
  
          <Select value={selectedMainCategory} onValueChange={handleMainCategoryChange}>
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Danh mục lớn" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.mainCategory} value={category.mainCategory}>
                  {category.mainCategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
  
          <Select 
            value={selectedSubCategory} 
            onValueChange={handleSubCategoryChange}
            /* disabled={!selectedMainCategory} */
          >
            <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Danh mục nhỏ" />
            </SelectTrigger>
            <SelectContent>
            {selectedMainCategory
              ? categories
                .find(c => c.mainCategory === selectedMainCategory)
                ?.subCategories.map(sub => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
              </SelectItem>
            ))
            : categories.flatMap(category =>
              category.subCategories.map(sub => (
          <SelectItem key={sub} value={sub}>
            {sub}
          </SelectItem>
        ))
      )}
            </SelectContent>
          </Select>
          
          <Button
            onClick={handleFilter}
            variant="outline"
            className="font-normal border-blue-400 text-blue-400 hover:bg-blue-50 border"
            disabled={!selectedSubCategory}
          >
            <Filter className="h-4 w-4 mr-2" />
            Lọc
          </Button>
        </div>
  
  
        <Button 
          onClick={() => navigate('/admin/books/add')}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm sách mới
        </Button>
      </div>
  
      <div className="overflow-x-auto border border-gray-200 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
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
            {displayItems?.map((book) => (
              <TableRow key={`book-${book.bookId}`} className="bg-gray-50/50 hover:bg-gray-100/80 border-gray-200">
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
                    "inline-flex items-center rounded-none px-2.5 py-0.5 text-xs font-medium",
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
          currentPage={displayCurrentPage}
          totalPages={displayTotalPages}
          onPageChange={handlePageChange}
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