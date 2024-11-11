// pages/admin/books/add_book.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBook } from '@/api/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const bookSchema = z.object({
  idBook: z.string().min(1, "Mã sách không được để trống"),
  name: z.string().min(1, "Tên sách không được để trống"),
  description: z.string(),
  author: z.string().transform(str => str.split(',').map(s => s.trim())),
  publicationYear: z.string()
    .transform(Number)
    .refine((n) => n >= 0, "Năm xuất bản không được âm"),
  bigCategory: z.string().min(1, "Danh mục lớn không được để trống"),
  smallCategory: z.string().min(1, "Danh mục nhỏ không được để trống"),
  quantity: z.string()
    .transform(Number)
    .refine((n) => n >= 0, "Số lượng không được âm"),
  availability: z.boolean().default(true),
  img: z.string().url("URL hình ảnh không hợp lệ"),
  nxb: z.string().min(1, "Nhà xuất bản không được để trống"),
}).transform(data => ({
  ...data,
  bigCategory: [{
    name: data.bigCategory,
    smallCategory: [data.smallCategory]
  }]
}));

type BookFormValues = z.infer<typeof bookSchema>;

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      availability: true,
    },
  });

  const onSubmit = async (data: BookFormValues) => {
    try {
      await createBook(data);
      navigate('/admin/books/list');
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Thêm sách mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="idBook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mã sách</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập mã sách..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
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

                <FormField
                  control={form.control}
                  name="author"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tác giả (ngăn cách bởi dấu phẩy)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên tác giả..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Năm xuất bản</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bigCategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục lớn</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên danh mục lớn..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smallCategory" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục nhỏ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên danh mục nhỏ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nxb"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhà xuất bản</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên nhà xuất bản..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="img"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Hình ảnh</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập URL hình ảnh..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Nhập mô tả sách..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin/books/list')}
                >
                  Hủy
                </Button>
                <Button type="submit">Thêm sách</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBook;