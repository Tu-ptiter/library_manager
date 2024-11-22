// layout/pages/admin/books/category_management.tsx
import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Check, X } from 'lucide-react'; // Add icons
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner';
import { CategoryData, fetchMainCategories, fetchSubCategories, updateBigCategory, updateSmallCategory } from '@/api/api';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = React.useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editingMainId, setEditingMainId] = React.useState<string | null>(null);
  const [editingSubId, setEditingSubId] = React.useState<string | null>(null);
  const [editMainName, setEditMainName] = React.useState('');
  const [editSubName, setEditSubName] = React.useState('');

  // Cache subcategories to avoid repeated API calls
  const subCategoriesCache = React.useRef<Record<string, string[]>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const mainCategories = await fetchMainCategories();
        const categoriesPromises = mainCategories.map(async (category) => {
          const subcategories = await fetchSubCategories(category);
          return { name: category, subcategories: subcategories.sort() };
        });
        const categoriesData = await Promise.all(categoriesPromises);
        setCategories(categoriesData.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditMain = (category: CategoryData) => {
    setEditingMainId(category.name);
    setEditMainName(category.name);
  };

  const handleEditSub = (mainCategory: string, subCategory: string) => {
    setEditingSubId(subCategory);
    setEditSubName(subCategory);
  };

  const handleSaveMain = async (oldName: string) => {
    try {
      await updateBigCategory(oldName, editMainName);
      setCategories(categories.map(cat => 
        cat.name === oldName ? { ...cat, name: editMainName } : cat
      ));
      setEditingMainId(null);
    } catch (err) {
      setError('Failed to update main category');
    }
  };

  const handleSaveSub = async (mainCategory: string, oldName: string) => {
    try {
      await updateSmallCategory(oldName, editSubName);
      setCategories(categories.map(cat => 
        cat.name === mainCategory ? { 
          ...cat, 
          subcategories: cat.subcategories.map(sub => sub === oldName ? editSubName : sub).sort() 
        } : cat
      ));
      setEditingSubId(null);
    } catch (err) {
      setError('Failed to update subcategory');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingMainId(null);
    setEditingSubId(null);
    setEditMainName('');
    setEditSubName('');
  };

  // Render category name cell with edit functionality
  const renderCategoryName = (category: CategoryData) => {
    if (editingMainId === category.name) {
      return (
        <div className="flex items-center gap-2">
          <input
            value={editMainName}
            onChange={(e) => setEditMainName(e.target.value)}
            className="border p-1 rounded"
          />
          <button
            onClick={() => handleSaveMain(category.name)}
            className="p-1 hover:bg-green-100 rounded"
          >
            <Check size={16} className="text-green-600" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-red-100 rounded"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span>{category.name}</span>
        <button
          onClick={() => handleEditMain(category)}
          className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
      </div>
    );
  };

  // Render subcategory name cell with edit functionality
  const renderSubCategoryName = (mainCategory: string, subCategory: string) => {
    if (editingSubId === subCategory) {
      return (
        <div className="flex items-center gap-2">
          <input
            value={editSubName}
            onChange={(e) => setEditSubName(e.target.value)}
            className="border p-1 rounded"
          />
          <button
            onClick={() => handleSaveSub(mainCategory, subCategory)}
            className="p-1 hover:bg-green-100 rounded"
          >
            <Check size={16} className="text-green-600" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-red-100 rounded"
          >
            <X size={16} className="text-red-600" />
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 group">
        <span>{subCategory}</span>
        <button
          onClick={() => handleEditSub(mainCategory, subCategory)}
          className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pencil size={16} className="text-gray-600" />
        </button>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Main Category</TableHead>
          <TableHead>Subcategories</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.name}>
            <TableCell>{renderCategoryName(category)}</TableCell>
            <TableCell>
              {category.subcategories.map(subCategory => (
                <div key={subCategory}>
                  {renderSubCategoryName(category.name, subCategory)}
                </div>
              ))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryManagement;