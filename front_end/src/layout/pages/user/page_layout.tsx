import React from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../../../components/header/Category';

const PageLayout: React.FC = () => {
  const { categoryName, subcategoryName } = useParams<{ categoryName?: string, subcategoryName?: string }>();

  if (!categoryName) {
    return <div>Category name is missing</div>;
  }

  const decodedCategoryName = decodeURIComponent(categoryName);
  const category = categories.find(cat => cat.name.toLowerCase() === decodedCategoryName.toLowerCase());

  if (!category) {
    return <div>Category not found</div>;
  }

  if (subcategoryName) {
    const decodedSubcategoryName = decodeURIComponent(subcategoryName);
    const subcategory = category.subcategories.find(sub => sub.toLowerCase() === decodedSubcategoryName.toLowerCase());
    if (!subcategory) {
      return <div>Subcategory not found</div>;
    }
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{subcategory}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
      <ul className="list-disc pl-5">
        {category.subcategories.map(subcategory => (
          <li key={subcategory} className="mb-2">
            <a href={`/category/${encodeURIComponent(categoryName.toLowerCase())}/${encodeURIComponent(subcategory.toLowerCase())}`} className="text-blue-500 hover:underline">
              {subcategory}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageLayout;