// api.tsx
import axios from 'axios';

// Define types based on db.json structure
interface Category {
  name: string;
  smallCategory: string[];
}

export interface Book {
  bookId: string;
  title: string;
  description: string;
  author: string[];
  publicationYear: number;
  bigCategory: Category[];
  quantity: number;
  availability: boolean;
  img: string;
  nxb: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Member {
  id?: string;        
  memberId: string;  
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  transactions: string[];
  booksBorrowed: number;
}

export interface CategoryData {
  name: string;
  subcategories: string[];
  isSubcategory?: boolean;
}

const BASE_URL = 'https://ffff-ajd8exg7evhnend0.canadacentral-01.azurewebsites.net/';

// Books API
export const fetchBooks = async (page: number = 1, size: number = 10): Promise<PaginatedResponse<Book>> => {
  try {
    const response = await axios.get<PaginatedResponse<Book>>(`${BASE_URL}/books`, {
      params: {
        page: Math.min(page - 1, 199), // Convert to 0-based index with max limit
        size: size
      }
    });
    return {
      ...response.data,
      currentPage: response.data.currentPage + 1, // Convert back to 1-based index
      totalPages: Math.min(response.data.totalPages, 200) // Limit max pages
    };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const updateBook = async (idBook: string, bookData: Partial<Book>): Promise<Book> => {
  try {
    const response = await axios.put<Book>(`${BASE_URL}/books/update/${idBook}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (idBook: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/books/delete/${idBook}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const createBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  try {
    const response = await axios.post<Book>(`${BASE_URL}/books`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};
export const searchBooks = async (query: string, searchType: 'title' | 'author'): Promise<Book[]> => {
  try {
    const response = await axios.get<Book[]>(`${BASE_URL}/books/search`, {
      params: {
        [searchType]: query // Only pass the selected search type parameter
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw error;
  }
};
// Members API
export const fetchMembers = async (): Promise<Member[]> => {
  try {
    const response = await axios.get<Member[]>(`${BASE_URL}/members`);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const createMember = async (memberData: Omit<Member, 'memberId'>): Promise<Member> => {
  try {
    const memberId = `672a281174f873211914d${Math.random().toString(36).substr(2, 3)}`;
    const newMember = {
      ...memberData,
      memberId,
      transactions: ['BORROW'],
      booksBorrowed: 0
    };
    const response = await axios.post<Member>(`${BASE_URL}/members`, newMember);
    return response.data;
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

export const updateMember = async (memberId: string, memberData: Partial<Member>): Promise<Member> => {
  try {
    const response = await axios.put<Member>(
      `${BASE_URL}/members/update/${memberId}`,
      memberData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (memberId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/members/delete/${memberId}`);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

export const fetchMainCategories = async (): Promise<string[]> => {
  try {
    const response = await axios.get<string[]>(`${BASE_URL}/books/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching main categories:', error);
    throw error;
  }
};

export const fetchSubCategories = async (categoryName: string): Promise<string[]> => {
  try {
    const slug = categoryName.toLowerCase()
      .replace(/\s+/g, '-')           
      .replace(/\//g, '-')            
      .normalize("NFD")               
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/đ/g, 'd');           
    
    const response = await axios.get<string[]>(`${BASE_URL}/books/categories/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching subcategories for ${categoryName}:`, error);
    return [];
  }
};

export const fetchTotalBooks = async (): Promise<number> => {
  try {
    const response = await axios.get<number>(`${BASE_URL}/books/total`);
    return response.data;
  } catch (error) {
    console.error('Error fetching total books:', error);
    throw error;
  }
};

interface CategoryDistribution {
  [category: string]: number;
}

// Add new API function
export const fetchCategoryDistribution = async (): Promise<CategoryDistribution> => {
  try {
    const response = await axios.get<CategoryDistribution>(`${BASE_URL}/books/category-distribution`);
    return response.data;
  } catch (error) {
    console.error('Error fetching category distribution:', error);
    throw error;
  }
};


export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/librarians/login`, { username, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Invalid username or password');
    }
    console.error('Error logging in:', error);
    throw error;
  }
};

export const changePassword = async (username: string, oldPassword: string, newPassword: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/librarians/change`, {
      username,
      oldPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || 'Có lỗi xảy ra khi đổi mật khẩu');
    }
    throw error;
  }
};

export const getOtp = async (username: string): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/librarians/send-otp`, { username });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || 'Không thể gửi mã OTP');
    }
    throw error;
  }
};

export const resetPassword = async (username: string, otp: string, newPassword: string): Promise<void> => {
  try {
    await axios.post(`${BASE_URL}/librarians/reset`, { username, otp, newPassword });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || 'Không thể đổi mật khẩu');
    }
    throw error;
  }
};