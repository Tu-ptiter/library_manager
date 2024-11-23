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
import { debounce } from 'lodash';
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
  const [categories, setCategories] = React.useState<{mainCategory: string, subCategories: string[]}[]>([]);
  const [selectedMainCategory, setSelectedMainCategory] = React.useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string>('');
  const [filteredBooks, setFilteredBooks] = React.useState<Book[] | null>(null);
  const [filterCurrentPage, setFilterCurrentPage] = React.useState(1);
  const itemsPerPage = 10;
  const [searchSuggestions, setSuggestions] = React.useState<Book[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);


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
      // Search both title and author simultaneously
      const titleResults = await searchBooks(searchTerm, 'title');
      const authorResults = await searchBooks(searchTerm, 'author');
      
      // Combine and deduplicate results based on bookId
      const combined = [...titleResults, ...authorResults];
      const uniqueResults = Array.from(
        new Map(combined.map(book => [book.bookId, book])).values()
      );
      
      setFilteredBooks(uniqueResults);
      setFilterCurrentPage(1);
      onSearch(uniqueResults);
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


// Add this function to fetch suggestions
const fetchSuggestions = React.useCallback(async (query: string) => {
  if (!query.trim()) {
    setSuggestions([]);
    return;
  }

  setIsLoadingSuggestions(true);
  try {
    const response = await axios.get<Book[]>(`${BASE_URL}/books/suggest`, {
      params: { query }
    });
    setSuggestions(response.data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    setSuggestions([]);
  } finally {
    setIsLoadingSuggestions(false);
  }
}, []);
  
// Add debounce for search input
const debouncedFetchSuggestions = React.useCallback(
  debounce((query: string) => fetchSuggestions(query), 300),
  [fetchSuggestions]
);



  const displayItems = filteredBooks ? paginatedFilteredBooks : currentItems;
  const displayCurrentPage = filteredBooks ? filterCurrentPage : currentPage;
  const displayTotalPages = filteredBooks ? filteredTotalPages : totalPages;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

// Update the search input change handler
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearchTerm(value);
  setShowSuggestions(true);
  debouncedFetchSuggestions(value);
};
// Add handler for selecting a suggestion
const handleSelectSuggestion = async (book: Book) => {
  setSearchTerm(book.title);
  setShowSuggestions(false);
  setFilteredBooks([book]);
  onSearch([book]);
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
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
    {/* Header Section - Same as before */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Tất cả sách</h2>
      <Button 
        onClick={() => navigate('/admin/books/add')}
        className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm sách mới
      </Button>
    </div>

    {/* Search and Filter Section - Enhanced responsiveness */}
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm theo tên sách hoặc tác giả..."
            className="pl-10 h-11 text-base border-gray-200 hover:border-gray-300 focus:border-blue-500 transition-colors w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleSearch}
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Tìm kiếm
          </Button>
          <Button
            onClick={handleResetSearch}
            variant="outline"
            className="w-full sm:w-auto h-11 px-6 font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Đặt lại
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={selectedMainCategory} onValueChange={handleMainCategoryChange}>
          <SelectTrigger className="h-11 w-full border-gray-200 hover:border-gray-300">
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

        <Select value={selectedSubCategory} onValueChange={handleSubCategoryChange}>
          <SelectTrigger className="h-11 w-full border-gray-200 hover:border-gray-300">
            <SelectValue placeholder="Danh mục nhỏ" />
          </SelectTrigger>
          <SelectContent>
            {selectedMainCategory
              ? categories
                  .find(c => c.mainCategory === selectedMainCategory)
                  ?.subCategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))
              : categories.flatMap(category =>
                  category.subCategories.map(sub => (
                    <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                  ))
                )}
          </SelectContent>
        </Select>

        <Button
          onClick={handleFilter}
          variant="outline"
          className="w-full sm:w-auto h-11 px-6 font-medium border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
          disabled={!selectedSubCategory}
        >
          <Filter className="h-4 w-4 mr-2" />
          Lọc
        </Button>
      </div>
    </div>

    {/* Enhanced Table Section */}
    <div className="-mx-4 sm:mx-0 rounded-none sm:rounded-lg border border-gray-200 overflow-hidden">
      <div className="relative overflow-x-auto min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80">
              <TableHead className="font-semibold text-gray-600 w-20 lg:w-28">Hình ảnh</TableHead>
              <TableHead className="font-semibold text-gray-600">Tên sách</TableHead>
              <TableHead className="font-semibold text-gray-600 hidden md:table-cell">Tác giả</TableHead>
              <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">Danh mục</TableHead>
              <TableHead className="font-semibold text-gray-600 hidden xl:table-cell">Năm XB</TableHead>
              <TableHead className="font-semibold text-gray-600 text-center hidden sm:table-cell">SL</TableHead>
              <TableHead className="font-semibold text-gray-600 hidden sm:table-cell">Trạng thái</TableHead>
              <TableHead className="font-semibold text-gray-600 text-right pr-4">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayItems?.map((book) => (
              <TableRow 
                key={`book-${book.bookId}`} 
                className="transition-colors hover:bg-gray-50/80"
              >
                <TableCell className="w-20 lg:w-28">
                  <img 
                    src={book.img} 
                    alt={book.title} 
                    className="w-16 h-20 object-cover rounded-sm shadow-sm hover:shadow-md transition-shadow"
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">{book.title}</h3>
                    {/* Show author on small screens */}
                    <p className="text-sm text-gray-500 md:hidden">
                      {book.author?.join(', ') || 'N/A'}
                    </p>
                    {/* Show category on small screens */}
                    <p className="text-sm text-gray-500 lg:hidden">
                      {book.bigCategory?.[0]?.smallCategory?.join(', ')}
                    </p>
                    {/* Show quantity and status on mobile */}
                    <div className="flex flex-col sm:hidden space-y-1 mt-2">
                      <div className="text-sm text-gray-500">
                        SL: {book.quantity} | {book.publicationYear}
                      </div>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium w-fit",
                        book.availability ? 
                          "bg-green-50 text-green-700 ring-1 ring-green-600/20" : 
                          "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                      )}>
                        {book.availability ? 'Còn sách' : 'Hết sách'}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {book.author?.join(', ') || 'N/A'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {book.bigCategory?.map((cat, index) => (
                    <span key={`${book.bookId}-${cat.name}-${index}`}>
                      {cat.smallCategory?.join(', ')}
                      {index < book.bigCategory.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {book.publicationYear}
                </TableCell>
                <TableCell className="text-center hidden sm:table-cell">
                  {book.quantity}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
                    book.availability ? 
                      "bg-green-50 text-green-700 ring-1 ring-green-600/20" : 
                      "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                  )}>
                    {book.availability ? 'Còn sách' : 'Hết sách'}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-1 pr-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-200 hover:border-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(book)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

    {/* Pagination */}
    <div className="mt-4 sm:mt-6 flex justify-center">
      <CustomPagination 
        currentPage={displayCurrentPage}
        totalPages={displayTotalPages}
        onPageChange={handlePageChange}
      />
    </div>

    {/* Modals - Same as before */}
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