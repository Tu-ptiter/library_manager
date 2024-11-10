// api.tsx
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

export interface Member {
  id?: string;        // Optional for real backend
  memberId: string;  // For business logic
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  transactions: string[];
  booksBorrowed: number;
}

const BASE_URL = 'http://localhost:5000';

// Books API
export const fetchBooks = async (): Promise<Book[]> => {
  try {
    const response = await axios.get<Book[]>(`${BASE_URL}/books`);
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book> => {
  try {
    const response = await axios.put<Book>(`${BASE_URL}/books/${id}`, bookData);
    return response.data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

export const deleteBook = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/books/${id}`);
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
    // Generate new memberId
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
    // First get the member to get their id
    const members = await fetchMembers();
    const member = members.find(m => m.memberId === memberId);
    
    if (!member) {
      throw new Error('Member not found');
    }

    // Use the member's id from json-server for the PUT request
    const updatedMember = {
      ...member,        // Keep existing data
      ...memberData,    // Update with new data
      id: member.id,    // Preserve json-server id
      memberId         // Keep original memberId
    };

    const response = await axios.put<Member>(
      `${BASE_URL}/members/${member.id}`, // Use id in URL
      updatedMember
    );
    return response.data;
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const deleteMember = async (memberId: string): Promise<void> => {
  try {
    // First get the member to get their id
    const members = await fetchMembers();
    const member = members.find(m => m.memberId === memberId);
    
    if (!member?.id) {
      throw new Error('Member not found');
    }

    // Use the member's json-server id for the DELETE request
    await axios.delete(`${BASE_URL}/members/${member.id}`);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};