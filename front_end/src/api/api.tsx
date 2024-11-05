import axios from 'axios';

// Define types based on db.json structure
interface Category {
  name: string;
  smallCategory: string[];
}

export interface Book {
  idBook: string;
  name: string;
  description: string;
  author: string[];
  publicationYear: number;
  bigCategory: Category[];
  quantity: number;
  availability: boolean;
  img: string;
  nxb: string;
}

const API_URL = 'http://localhost:5000/books';

export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await axios.get<Book[]>(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  try {
    const response = await axios.put<Book>(`${API_URL}/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

export const createBook = async (bookData: Omit<Book, 'id'>): Promise<Book> => {
  try {
    const response = await axios.post<Book>(API_URL, bookData);
    return response.data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};