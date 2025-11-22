import { create } from 'zustand';
import {
  getAllBooks,
  addBook,
  deleteBook as deleteBookRepo,
} from '@/database/repositories/bookRepository';

interface BookStore {
  books: {
    id: number;
    title: string;
    url: string;
    description: string;
    img: string;
    author: string;
    type: string;
    lastReadingAt: number;
    createdAt: number;
  }[];
  loadBooks: () => Promise<void>;
  isLoaded: boolean;
  addBook: (book: BookModel) => Promise<number | false>;
  updateBookLastReadingAt: (bookId: number, newTime: number) => void;
  deleteBook: (bookId: number) => Promise<boolean>;
}

interface BookModel {
  title: string | null;
  url?: string | null;
  imgPath?: string | null;
  author?: string | null;
  type?: string | null;
  createdAt?: number | null;
  lastReadingAt?: number | null;
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  isLoaded: false,

  loadBooks: async () => {
    if (get().isLoaded) return;
    const books = await getAllBooks();
    set({ books: [...books], isLoaded: true });
    console.log('Books | Fetch Atıldı, MOUNT OLDU');
  },

  addBook: async (book) => {
    const newBook = await addBook(book as any);
    if (!newBook) return false;
    set((state) => ({ books: [...state.books, newBook] }));
    return newBook.id;
  },

  updateBookLastReadingAt: (bookId: number, newTime: number) => {
    set((state) => ({
      books: state.books.map((b) => (b.id === bookId ? { ...b, lastReadingAt: newTime } : b)),
    }));
  },

  deleteBook: async (bookId: number) => {
    const success = await deleteBookRepo(bookId);
    if (success) {
      set((state) => ({
        books: state.books.filter((b) => b.id !== bookId),
      }));
    }
    return success;
  },
}));
