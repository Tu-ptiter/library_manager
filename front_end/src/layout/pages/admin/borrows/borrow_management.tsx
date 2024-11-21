// layout/pages/admin/borrows/borrow_management.tsx
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Book, ArrowLeftRight, RefreshCw, UserCheck } from 'lucide-react';

type TabType = 'borrow' | 'return' | 'renew';

const transactionSchema = z.object({
  name: z.string().min(1, "Tên người dùng không được để trống"),
  phoneNumber: z.string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không được quá 11 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  title: z.string().min(1, "Tên sách không được để trống"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const TransactionForm: React.FC<{
  type: TabType;
  onSubmit: (data: TransactionFormValues) => Promise<void>;
}> = ({ type, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{text: string; type: 'success' | 'error'} | null>(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      title: ''
    }
  });

  const handleSubmit = async (data: TransactionFormValues) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      await onSubmit(data);
      form.reset();
      setMessage({
        text: `Thao tác ${type === 'borrow' ? 'mượn' : type === 'return' ? 'trả' : 'gia hạn'} sách thành công`,
        type: 'success'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra';
      setMessage({
        text: errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Tên người dùng</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập tên người dùng..." 
                    {...field}
                    className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Số điện thoại</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Nhập số điện thoại..." 
                    {...field}
                    className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Tên sách</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nhập tên sách..." 
                  {...field}
                  className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          } transition-all duration-300 animate-fade-in`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="transition-all duration-200 hover:shadow-lg"
          >
            {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
            {type === 'borrow' ? (
              <>
                <Book className="w-4 h-4 mr-2" />
                Mượn sách
              </>
            ) : type === 'return' ? (
              <>
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Trả sách
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Gia hạn
              </>
            )}
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
      phoneNumber: data.phoneNumber
    });
  };

  const handleReturn = async (data: TransactionFormValues) => {
    await returnBook({
      name: data.name,
      title: data.title,
      phoneNumber: data.phoneNumber
    });
  };

  const handleRenew = async (data: TransactionFormValues) => {
    await renewBook({
      name: data.name,
      title: data.title,
      phoneNumber: data.phoneNumber
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">
              <UserCheck className="w-6 h-6 inline-block mr-2 mb-1" />
              Quản lý mượn trả sách
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="borrow" 
              className="w-full"
              onValueChange={(value) => setActiveTab(value as TabType)}
            >
              <TabsList className="mb-8 grid grid-cols-3 gap-4 bg-muted/50 p-1">
                <TabsTrigger 
                  value="borrow"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Book className="w-4 h-4 mr-2" />
                  Mượn sách
                </TabsTrigger>
                <TabsTrigger 
                  value="return"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Trả sách
                </TabsTrigger>
                <TabsTrigger 
                  value="renew"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Gia hạn
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="borrow">
                  <TransactionForm type="borrow" onSubmit={handleBorrow} />
                </TabsContent>

                <TabsContent value="return">
                  <TransactionForm type="return" onSubmit={handleReturn} />
                </TabsContent>

                <TabsContent value="renew">
                  <TransactionForm type="renew" onSubmit={handleRenew} />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorrowManagement;