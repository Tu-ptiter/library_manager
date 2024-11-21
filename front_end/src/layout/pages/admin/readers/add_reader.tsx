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
import { Plus, UserPlus } from 'lucide-react';
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
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">
              <UserPlus className="w-6 h-6 inline-block mr-2 mb-1" />
              Thêm người đọc mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Họ và tên <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            required
                            placeholder="Nhập họ và tên..."
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            required
                            type="email"
                            placeholder="Nhập email..."
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
                        <FormLabel className="text-gray-700">
                          Số điện thoại <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            required
                            placeholder="Nhập số điện thoại..."
                            maxLength={11}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Địa chỉ <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            required
                            placeholder="Nhập địa chỉ..."
                            {...field}
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500"
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
                    className="transition-all duration-200 hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    className="transition-all duration-200 hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm người đọc
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

export default AddReader;