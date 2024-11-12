import { Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { categories } from './Category'; // Import categories

export default function Component() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="/" className="text-2xl font-bold">
          Library Management System
        </a>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 flex items-center gap-2">
                Category
                <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border-gray-700 w-auto max-w-3xl">
              <DropdownMenuLabel>Select a category</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <div className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                  {categories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <h3 className="font-bold text-lg">{category.name}</h3>
                      {category.subcategories.map((subcategory) => (
                        <DropdownMenuItem key={subcategory} className="p-0">
                          <a href={`/category/${encodeURIComponent(category.name.toLowerCase())}/${encodeURIComponent(subcategory.toLowerCase())}`} className="cursor-pointer w-full px-2 py-1 hover:bg-gray-700 rounded text-sm">
                            {subcategory}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 flex items-center gap-2">
                Sort
                <ChevronDown className="h-4 w-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem>
                <button className="w-full text-left" onClick={() => console.log('Sort A-Z')}>A-Z</button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="w-full text-left" onClick={() => console.log('Sort Z-A')}>Z-A</button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="w-full text-left" onClick={() => console.log('Sort Oldest')}>Oldest</button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button className="w-full text-left" onClick={() => console.log('Sort Newest')}>Newest</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="search"
              placeholder="Search books..."
              className="pl-8 bg-gray-800 text-white border-gray-700 placeholder-gray-400 w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
}