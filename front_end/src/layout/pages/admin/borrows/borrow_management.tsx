// layout/pages/admin/borrows/borrow_management.tsx
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { borrowBook } from '@/api/api';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { Book, UserCheck } from 'lucide-react';

const transactionSchema = z.object({
  name: z.string().min(1, "Tên người dùng không được để trống"),
  phoneNumber: z.string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không được quá 11 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  title: z.string().min(1, "Tên sách không được để trống"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

const BorrowManagement: React.FC = () => {
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
      await borrowBook({
        name: data.name,
        title: data.title,
        phoneNumber: data.phoneNumber
      });
      form.reset();
      setMessage({
        text: 'Mượn sách thành công',
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
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">
              <UserCheck className="w-6 h-6 inline-block mr-2 mb-1" />
              Thêm phiếu mượn
            </CardTitle>
          </CardHeader>
          <CardContent>
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
                    <Book className="w-4 h-4 mr-2" />
                    Mượn sách
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BorrowManagement;