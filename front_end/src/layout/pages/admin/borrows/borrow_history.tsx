// src/layout/pages/admin/borrows/borrow_history.tsx
import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction, fetchBorrowedTransactions, fetchReturnedTransactions, fetchRenewedTransactions } from '@/api/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { cn } from "@/lib/utils";
import CustomPagination from '@/components/custom-pagination';

type TabType = 'borrowed' | 'returned' | 'renewed';
const ITEMS_PER_PAGE = 5;

interface TransactionTableProps {
  transactions: Transaction[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  currentPage,
  onPageChange 
}) => {
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTransactions = transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-medium">Người mượn</TableHead>
              <TableHead className="font-medium">Tên sách</TableHead>
              <TableHead className="font-medium">Mô tả</TableHead>
              <TableHead className="font-medium">Ngày giao dịch</TableHead>
              <TableHead className="font-medium">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction, index) => (
              <TableRow key={`${transaction.memberId}-${index}`} className={cn("bg-gray-50/50 hover:bg-gray-100/80 border-gray-200")}>
                <TableCell>{transaction.memberName}</TableCell>
                <TableCell>{transaction.bookTitle}</TableCell>
                <TableCell className="max-w-[300px] truncate">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.transactionDate), 'HH:mm dd/MM/yyyy', { locale: vi })}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                    ${transaction.status === 'Đã trả' ? 
                      'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                    {transaction.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {transactions.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

const BorrowHistory: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('borrowed');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);

  const fetchTransactions = React.useCallback(async (type: TabType) => {
    setIsLoading(true);
    try {
      let data: Transaction[] = [];
      switch (type) {
        case 'borrowed':
          data = await fetchBorrowedTransactions();
          break;
        case 'returned':
          data = await fetchReturnedTransactions();
          break;
        case 'renewed':
          data = await fetchRenewedTransactions();
          break;
      }
      setTransactions(data);
      setCurrentPage(1); // Reset to first page when changing tabs
    } catch (error) {
      console.error(`Error fetching ${type} transactions:`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions(activeTab);
  }, [activeTab, fetchTransactions]);

  return (
    <div className="p-4 mt-6 sm:p-6 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Lịch sử mượn trả</h2>
      </div>
  
      {/* Tab Navigation */}
      <Tabs defaultValue="borrowed" className="w-full" onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="mb-4 flex space-x-2 bg-transparent">
          <TabsTrigger 
            value="borrowed" 
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200"
          >
            Đang mượn
          </TabsTrigger>
          <TabsTrigger 
            value="returned"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:border-green-200"
          >
            Đã trả
          </TabsTrigger>
          <TabsTrigger 
            value="renewed"
            className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-purple-200"
          >
            Đã gia hạn
          </TabsTrigger>
        </TabsList>
  
        {/* Table Content for Each Tab */}
        {['borrowed', 'returned', 'renewed'].map((tab) => (
          <TabsContent value={tab} key={tab}>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="-mx-4 sm:mx-0 rounded-none sm:rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative overflow-x-auto min-h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/80">
                        <TableHead className="font-semibold text-gray-600">Người mượn</TableHead>
                        <TableHead className="font-semibold text-gray-600 hidden sm:table-cell">Tên sách</TableHead>
                        <TableHead className="font-semibold text-gray-600 hidden lg:table-cell">Mô tả</TableHead>
                        <TableHead className="font-semibold text-gray-600 hidden md:table-cell">Ngày giao dịch</TableHead>
                        <TableHead className="font-semibold text-gray-600">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction, index) => (
                        <TableRow 
                          key={`${transaction.memberId}-${index}`} 
                          className="transition-colors hover:bg-gray-50/80"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-gray-900">
                                {transaction.memberName}
                              </p>
                              {/* Show book title on mobile */}
                              <p className="text-sm text-gray-500 sm:hidden">
                                {transaction.bookTitle}
                              </p>
                              {/* Show date on mobile */}
                              <p className="text-sm text-gray-500 md:hidden">
                                {format(new Date(transaction.transactionDate), 'HH:mm dd/MM/yyyy', { locale: vi })}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {transaction.bookTitle}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                            {transaction.description}
                          </TableCell>
                          <TableCell className="hidden md:table-cell whitespace-nowrap">
                            {format(new Date(transaction.transactionDate), 'HH:mm dd/MM/yyyy', { locale: vi })}
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
                              {
                                "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20": 
                                  transaction.status === 'Đang mượn',
                                "bg-green-50 text-green-700 ring-1 ring-green-600/20": 
                                  transaction.status === 'Đã trả',
                                "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20": 
                                  transaction.status === 'Đã gia hạn',
                              }
                            )}>
                              {transaction.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
  
            {/* Pagination */}
            {transactions.length > ITEMS_PER_PAGE && (
              <div className="mt-4 sm:mt-6 flex justify-center">
                <CustomPagination 
                  currentPage={currentPage}
                  totalPages={Math.ceil(transactions.length / ITEMS_PER_PAGE)}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BorrowHistory;