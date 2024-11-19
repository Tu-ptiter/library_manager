// add_reader.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createMember } from '@/api/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const memberSchema = z.object({
  name: z.string()
    .min(1, "Tên không được để trống")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),
  email: z.string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  phoneNumber: z.string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .max(11, "Số điện thoại không được quá 11 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  address: z.string()
    .min(1, "Địa chỉ không được để trống")
    .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
});

type MemberFormValues = z.infer<typeof memberSchema>;

const AddReader: React.FC = () => {
  const navigate = useNavigate();
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      address: ''
    }
  });

  const onSubmit = async (data: MemberFormValues) => {
    try {
      await createMember(data);
      navigate('/admin/readers/list');
    } catch (error) {
      console.error('Error creating member:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="rounded-none">
        <CardHeader>
          <CardTitle>Thêm người đọc mới</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input required placeholder="Nhập họ và tên..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email" 
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          required
                          type="email"
                          placeholder="Nhập email..."
                          {...field}
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
                      <FormLabel>Số điện thoại <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          required
                          placeholder="Nhập số điện thoại..."
                          maxLength={11}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input 
                          required
                          placeholder="Nhập địa chỉ..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/admin/readers/list')}
                >
                  Hủy
                </Button>
                <Button type="submit">Thêm người đọc</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddReader;