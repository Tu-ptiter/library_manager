// src/layout/pages/admin/borrows/borrow_history.tsx
import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Transaction, fetchBorrowedTransactions, fetchReturnedTransactions, fetchRenewedTransactions } from '@/api/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { cn } from "@/lib/utils";
import CustomPagination from '@/components/custom-pagination';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import ReturnBookModal from '@/components/ReturnBookModal/ReturnBookModal';
import RenewBookModal from '@/components/RenewBookModal/RenewBookModal';

type TabType = 'borrowed' | 'returned' | 'renewed';
const ITEMS_PER_PAGE = 5;

interface ActionModalState {
  type: 'return' | 'renew' | null;
  transaction: Transaction | null;
}

const BorrowHistory: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('borrowed');
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [actionModal, setActionModal] = React.useState<ActionModalState>({
    type: null,
    transaction: null
  });

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
      setCurrentPage(1);
    } catch (error) {
      console.error(`Error fetching ${type} transactions:`, error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchTransactions(activeTab);
  }, [activeTab, fetchTransactions]);

  const handleActionComplete = () => {
    setActionModal({ type: null, transaction: null });
    fetchTransactions(activeTab);
  };

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-4 mt-6 sm:p-6 space-y-4 sm:space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Quản lý mượn trả</h2>
      </div>

      <Tabs defaultValue="borrowed" className="w-full" onValueChange={(value) => setActiveTab(value as TabType)}>
        <TabsList className="mb-4 flex space-x-2 bg-transparent">
          <TabsTrigger value="borrowed" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:border-blue-200">
            Đang mượn
          </TabsTrigger>
          <TabsTrigger value="returned" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-600 data-[state=active]:border-green-200">
            Đã trả
          </TabsTrigger>
          <TabsTrigger value="renewed" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-600 data-[state=active]:border-purple-200">
            Đã gia hạn
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
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
                      <TableHead className="font-semibold text-gray-600">Số điện thoại</TableHead>
                      <TableHead className="font-semibold text-gray-600">Tên sách</TableHead>
                      <TableHead className="font-semibold text-gray-600">Tác giả</TableHead>
                      <TableHead className="font-semibold text-gray-600">Ngày mượn</TableHead>
                      <TableHead className="font-semibold text-gray-600">Hạn trả</TableHead>
                      <TableHead className="font-semibold text-gray-600">Trạng thái</TableHead>
                      <TableHead className="font-semibold text-gray-600 text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => (
                      <TableRow key={`${transaction.memberId}-${index}`} className="transition-colors hover:bg-gray-50/80">
                        <TableCell className="font-medium">{transaction.memberName}</TableCell>
                        <TableCell>{transaction.phoneNumber}</TableCell>
                        <TableCell>{transaction.bookTitle}</TableCell>
                        <TableCell>{transaction.author}</TableCell>
                        <TableCell>{format(new Date(transaction.transactionDate), 'HH:mm dd/MM/yyyy', { locale: vi })}</TableCell>
                        <TableCell>{format(new Date(transaction.dueDate), 'HH:mm dd/MM/yyyy', { locale: vi })}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
                            {
                              "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20": transaction.status === 'Đang mượn',
                              "bg-green-50 text-green-700 ring-1 ring-green-600/20": transaction.status === 'Đã trả',
                              "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20": transaction.status === 'Đã gia hạn',
                            }
                          )}>
                            {transaction.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {transaction.status === 'Đang mượn' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActionModal({ type: 'return', transaction })}
                                className="border-green-200 text-green-700 hover:bg-green-50"
                              >
                                <ArrowLeftRight className="h-4 w-4 mr-1" />
                                Trả sách
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setActionModal({ type: 'renew', transaction })}
                                className="border-purple-200 text-purple-700 hover:bg-purple-50"
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Gia hạn
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {transactions.length > ITEMS_PER_PAGE && (
            <div className="mt-4 sm:mt-6 flex justify-center">
              <CustomPagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>

      {actionModal.type === 'return' && actionModal.transaction && (
        <ReturnBookModal
          transaction={actionModal.transaction}
          onClose={() => setActionModal({ type: null, transaction: null })}
          onSuccess={handleActionComplete}
        />
      )}

      {actionModal.type === 'renew' && actionModal.transaction && (
        <RenewBookModal
          transaction={actionModal.transaction}
          onClose={() => setActionModal({ type: null, transaction: null })}
          onSuccess={handleActionComplete}
        />
      )}
    </div>
  );
};

export default BorrowHistory;