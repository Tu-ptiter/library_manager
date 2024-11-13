// layout/pages/admin/books/category_management.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingSpinner  from '@/components/LoadingSpinner/LoadingSpinner';
import { 
  CategoryData, 
  fetchMainCategories, 
  fetchSubCategories 
} from '@/api/api';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = React.useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      // Fetch main categories
      const mainCategories = await fetchMainCategories();

      // Fetch subcategories for each main category
      const categoriesWithSubs = await Promise.all(
        mainCategories.map(async (category) => {
          const subcategories = await fetchSubCategories(category);
          return {
            name: category,
            subcategories: subcategories
          };
        })
      );

      setCategories(categoriesWithSubs);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Có lỗi xảy ra khi tải danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const flattenedCategories = React.useMemo(() => {
    const flattened: CategoryData[] = [];
    categories.forEach(category => {
      // Add main category
      flattened.push({
        name: category.name,
        subcategories: [],
      });
      // Add subcategories with proper indentation
      if (category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
          flattened.push({
            name: sub,
            subcategories: [],
            isSubcategory: true,
          });
        });
      }
    });
    return flattened;
  }, [categories]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý Danh mục</h1>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-medium text-gray-700 w-full">Tên danh mục</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flattenedCategories.map((category, index) => (
              <TableRow 
                key={`${category.name}-${index}`}
                className="bg-gray-50/50 hover:bg-gray-100/80 border-gray-200"
              >
                <TableCell 
                  className={`font-medium ${
                    category.isSubcategory 
                      ? 'pl-8 text-gray-600' 
                      : 'font-bold'
                  }`}
                >
                  {category.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CategoryManagement;