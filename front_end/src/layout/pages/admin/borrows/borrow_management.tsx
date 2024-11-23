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
import { Book, UserCheck, Search } from 'lucide-react';
import axios from 'axios';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = 'https://library-mana.azurewebsites.net';

interface BookSuggestion {
  bookId: string;
  title: string;
}

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
  const [suggestions, setSuggestions] = React.useState<BookSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const suggestionRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Add click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      title: ''
    }
  });

  const fetchSuggestions = React.useCallback(async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await axios.get<BookSuggestion[]>(`${BASE_URL}/books/suggest`, {
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

  const handleTitleChange = (value: string) => {
    form.setValue('title', value);
    setShowSuggestions(true);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (title: string) => {
    form.setValue('title', title);
    // Đóng dropdown và xóa suggestions
    setShowSuggestions(false);  
    setSuggestions([]);
    // Blur input để đóng focus
    (document.activeElement as HTMLElement)?.blur();
  };

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
                    <FormItem className="relative">
                      <FormLabel className="text-gray-700">Tên sách</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Nhập tên sách..." 
                            {...field}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            className="pl-10 transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
                          />
                        </div>
                      </FormControl>
                      {showSuggestions && (field.value || isLoadingSuggestions) && (
                        <div ref={suggestionRef} className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
                          {isLoadingSuggestions ? (
                            <div className="p-4 text-center text-gray-500">
                              <LoadingSpinner className="w-5 h-5 mx-auto" />
                              <span className="text-sm">Đang tìm kiếm...</span>
                            </div>
                          ) : suggestions.length > 0 ? (
                            <ul className="max-h-60 overflow-auto py-2">
                              {suggestions.map((book) => (
                                <li
                                  key={book.bookId}
                                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors duration-100"
                                  onClick={() => handleSelectSuggestion(book.title)}
                                >
                                  {book.title}
                                </li>
                              ))}
                            </ul>
                          ) : field.value ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Không tìm thấy sách
                            </div>
                          ) : null}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {message && (
                  <div className={`p-4 rounded-lg ${
                    message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={cn(
                      "relative",
                      "transition-all duration-300",
                      "hover:shadow-lg",
                      isSubmitting && "animate-pulse"
                    )}
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <motion.div 
                            className="border-2 border-white border-t-transparent h-5 w-5 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear"
                            }}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="content"
                          className="flex items-center"
                        >
                          <Book className="w-4 h-4 mr-2" />
                          Mượn sách
                        </motion.div>
                      )}
                    </AnimatePresence>
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