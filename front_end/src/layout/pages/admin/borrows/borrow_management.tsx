// layout/pages/admin/borrows/borrow_management.tsx
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { borrowBook, returnBook, renewBook } from '@/api/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';

// Update TransactionRequest interface in api.tsx
interface TransactionRequest {
  name: string;
  title: string;
  memberId?: string;
}

type TabType = 'borrow' | 'return' | 'renew';

const transactionSchema = z.object({
  name: z.string().min(1, "Tên người dùng không được để trống"),
  memberId: z.string().optional(),
  title: z.string().min(1, "Tên sách không được để trống"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const TransactionForm: React.FC<{
  type: TabType;
  onSubmit: (data: TransactionFormValues) => Promise<void>;
}> = ({ type, onSubmit }) => {
  const [showIdField, setShowIdField] = React.useState(false);
  const [duplicateMessage, setDuplicateMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{text: string; type: 'success' | 'error'} | null>(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: '',
      memberId: '',
      title: ''
    }
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      await onSubmit(data);
      form.reset();
      setShowIdField(false);
      setDuplicateMessage(null);
      setMessage({
        text: `Thao tác ${type === 'borrow' ? 'mượn' : type === 'return' ? 'trả' : 'gia hạn'} sách thành công`,
        type: 'success'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      
      // Add detailed error checking for duplicate names
      if (errorMessage.includes('Có nhiều thành viên trùng tên')) {
        setDuplicateMessage(errorMessage);
        setShowIdField(true);
      } 
      
      setMessage({
        text: errorMessage.includes('Có nhiều thành viên trùng tên') 
          ? "Vui lòng chọn ID người dùng từ danh sách trên"
          : errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset states when form is cleared
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'name' && !value.name) {
        setShowIdField(false);
        setDuplicateMessage(null);
        setMessage(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên người dùng</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên người dùng..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {duplicateMessage && (
          <div className="text-sm space-y-2 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="whitespace-pre-line text-yellow-700">{duplicateMessage}</p>
          </div>
        )}

        {showIdField && (
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Người dùng</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập ID người dùng từ danh sách trên..." 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sách</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên sách..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
            {type === 'borrow' ? 'Mượn sách' : type === 'return' ? 'Trả sách' : 'Gia hạn'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const BorrowManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<TabType>('borrow');

  const handleBorrow = async (data: TransactionFormValues) => {
    await borrowBook({
      name: data.name,
      title: data.title,
      ...(data.memberId && { memberId: data.memberId })
    });
  };

  const handleReturn = async (data: TransactionFormValues) => {
    await returnBook({
      name: data.name,
      title: data.title,
      ...(data.memberId && { memberId: data.memberId })
    });
  };

  const handleRenew = async (data: TransactionFormValues) => {
    await renewBook({
      name: data.name,
      title: data.title,
      ...(data.memberId && { memberId: data.memberId })
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý mượn trả</h1>
      
      <div className="max-w-xl mx-auto">
        <Tabs defaultValue="borrow" className="w-full" onValueChange={(value) => setActiveTab(value as TabType)}>
          <TabsList className="mb-4">
            <TabsTrigger value="borrow">Mượn sách</TabsTrigger>
            <TabsTrigger value="return">Trả sách</TabsTrigger>
            <TabsTrigger value="renew">Gia hạn</TabsTrigger>
          </TabsList>

          <TabsContent value="borrow">
            <TransactionForm type="borrow" onSubmit={handleBorrow} />
          </TabsContent>

          <TabsContent value="return">
            <TransactionForm type="return" onSubmit={handleReturn} />
          </TabsContent>

          <TabsContent value="renew">
            <TransactionForm type="renew" onSubmit={handleRenew} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BorrowManagement;