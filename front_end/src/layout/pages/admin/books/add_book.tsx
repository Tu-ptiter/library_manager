// pages/admin/books/add_book.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; 
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createBook, fetchMainCategories, fetchSubCategories } from '@/api/api';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { Plus, BookOpen } from 'lucide-react'; 
interface Category {
  mainCategory: string;
  subCategories: string[];
}

const bookSchema = z.object({
  title: z.string().min(1, "Tên sách không được để trống"),
  description: z.string(),
  author: z.string()
    .min(1, "Tác giả không được để trống")
    .transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
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
});

type BookFormValues = z.infer<typeof bookSchema>;

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = React.useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = React.useState<string>('');
  const [isCustomMainCategory, setIsCustomMainCategory] = React.useState(false);
  const [isCustomSubCategory, setIsCustomSubCategory] = React.useState(false);
  const [customMainCategory, setCustomMainCategory] = React.useState('');
  const [customSubCategory, setCustomSubCategory] = React.useState('');

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      description: '',
      author: '',
      publicationYear: '',
      bigCategory: '',
      smallCategory: '',
      quantity: '',
      availability: true,
      img: '',
      nxb: '',
    },
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const mainCategories = await fetchMainCategories();
        
        const categoriesWithSubs = await Promise.all(
          mainCategories.map(async (category) => {
            const subCategories = await fetchSubCategories(category);
            return {
              mainCategory: category,
              subCategories
            };
          })
        );
        
        setCategories(categoriesWithSubs);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleMainCategoryChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomMainCategory(true);
      setIsCustomSubCategory(true);
      setSelectedMainCategory('');
      setSelectedSubCategory('');
    } else {
      setIsCustomMainCategory(false);
      setIsCustomSubCategory(false);
      setSelectedMainCategory(value);
      form.setValue('bigCategory', value);
      
      const category = categories.find(c => c.mainCategory === value);
      if (category && !category.subCategories.includes(selectedSubCategory)) {
        setSelectedSubCategory('');
        form.setValue('smallCategory', '');
      }
    }
  };

  const handleSubCategoryChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomSubCategory(true);
      setSelectedSubCategory('');
    } else {
      setIsCustomSubCategory(false);
      setSelectedSubCategory(value);
      form.setValue('smallCategory', value);
      
      if (!selectedMainCategory) {
        const category = categories.find(c => c.subCategories.includes(value));
        if (category) {
          setSelectedMainCategory(category.mainCategory);
          form.setValue('bigCategory', category.mainCategory);
        }
      }
    }
  };

  const onSubmit = async (data: BookFormValues) => {
    try {
      const finalData = {
        ...data,
        // Remove the split since Zod already handles the transformation
        author: Array.isArray(data.author) ? data.author : [data.author],
        bigCategory: [{
          name: isCustomMainCategory ? customMainCategory : data.bigCategory,
          smallCategory: [isCustomSubCategory ? customSubCategory : data.smallCategory]
        }],
        bookId: undefined
      };
  
      await createBook(finalData);
      toast.success('Thêm sách thành công');
      navigate('/admin/books/list');
    } catch (error) {
      console.error('Error creating book:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Có lỗi xảy ra khi thêm sách');
      }
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-2xl font-bold text-center">
              <BookOpen className="w-6 h-6 inline-block mr-2 mb-1" />
              Thêm sách mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 ">Tên sách</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên sách..." 
                            {...field}
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100" 
                          />
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
                        <FormLabel className="text-gray-700">Tác giả (ngăn cách bởi dấu phẩy)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên tác giả..." 
                            {...field} 
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                          />
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
                        <FormLabel className="text-gray-700">Năm xuất bản</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field} 
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                          />
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
                        <FormLabel className="text-gray-700">Số lượng</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            {...field}
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                          />
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
                        <FormLabel className="text-gray-700">Danh mục lớn</FormLabel>
                        <FormControl>
                          {isCustomMainCategory ? (
                            <Input
                              placeholder="Nhập tên danh mục lớn..."
                              value={customMainCategory}
                              onChange={(e) => {
                                setCustomMainCategory(e.target.value);
                                form.setValue('bigCategory', e.target.value);
                              }}
                              className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                            />
                          ) : (
                            <Select onValueChange={handleMainCategoryChange} value={selectedMainCategory}>
                              <SelectTrigger className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100">
                                <SelectValue placeholder="Chọn danh mục lớn" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.mainCategory} value={category.mainCategory}>
                                    {category.mainCategory}
                                  </SelectItem>
                                ))}
                                <SelectItem value="custom">+ Tùy chọn</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
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
                        <FormLabel className="text-gray-700">Danh mục nhỏ</FormLabel>
                        <FormControl>
                          {isCustomSubCategory ? (
                            <Input
                              placeholder="Nhập tên danh mục nhỏ..."
                              value={customSubCategory}
                              onChange={(e) => {
                                setCustomSubCategory(e.target.value);
                                form.setValue('smallCategory', e.target.value);
                              }}
                              className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 "
                            />
                          ) : (
                            <Select onValueChange={handleSubCategoryChange} value={selectedSubCategory}>
                              <SelectTrigger className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100">
                                <SelectValue placeholder="Chọn danh mục nhỏ" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedMainCategory
                                  ? categories
                                      .find(c => c.mainCategory === selectedMainCategory)
                                      ?.subCategories.map(sub => (
                                        <SelectItem key={sub} value={sub}>
                                          {sub}
                                        </SelectItem>
                                      ))
                                  : categories.flatMap(category =>
                                      category.subCategories.map(sub => (
                                        <SelectItem key={sub} value={sub}>
                                          {sub}
                                        </SelectItem>
                                      ))
                                    )}
                                <SelectItem value="custom">+ Tùy chọn</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
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
                        <FormLabel className="text-gray-700">Nhà xuất bản</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập tên nhà xuất bản..." 
                            {...field}
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                          />
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
                        <FormLabel className="text-gray-700">URL Hình ảnh</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nhập URL hình ảnh..." 
                            {...field}
                            className="transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                          />
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
                      <FormLabel className="text-gray-700">Mô tả</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Nhập mô tả sách..." 
                          {...field}
                          className="min-h-[120px] transition-all duration-200 hover:border-blue-400 focus:border-blue-500 bg-slate-100"
                        />
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
                    className="transition-all duration-200 hover:bg-gray-100"
                  >
                    Hủy
                  </Button>
                  <Button 
                    type="submit"
                    className="transition-all duration-200 hover:shadow-lg bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm sách
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

export default AddBook;