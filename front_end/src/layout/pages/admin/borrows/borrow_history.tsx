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
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Lịch sử mượn trả</h1>
      
      <Tabs defaultValue="borrowed" className="w-full" onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="mb-4">
          <TabsTrigger value="borrowed">Đã mượn</TabsTrigger>
          <TabsTrigger value="returned">Đã trả</TabsTrigger>
          <TabsTrigger value="renewed">Đã gia hạn</TabsTrigger>
        </TabsList>

        <TabsContent value="borrowed">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : (
            <TransactionTable 
              transactions={transactions} 
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="returned">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : (
            <TransactionTable 
              transactions={transactions}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>

        <TabsContent value="renewed">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : (
            <TransactionTable 
              transactions={transactions}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BorrowHistory;