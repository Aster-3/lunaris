import {
  addBookMark,
  getAllBookMarks,
  removeBookMark,
} from '@/database/repositories/bookmarksRepository';
import { create } from 'zustand';
interface BookMarkStore {
  bookmarks: { id: number; book_id: number }[];
  isLoaded: boolean;
  loadBookMarks: () => Promise<void>;
  addBookMark: (bookId: number) => Promise<true | null>;
  deleteBookMark: (bookId: number) => Promise<any>;
}

export const useBookMarkStore = create<BookMarkStore>((set, get) => ({
  bookmarks: [],
  isLoaded: false,

  loadBookMarks: async () => {
    if (get().isLoaded) return;
    const bookmarks = await getAllBookMarks();
    console.log('BookMarks Fetch Request ||');
    set({ bookmarks, isLoaded: true });
  },

  addBookMark: async (bookId: number) => {
    const addedBookmark = await addBookMark(bookId);
    if (!addedBookmark) {
      return null;
    }
    set((state) => ({ bookmarks: [addedBookmark, ...state.bookmarks] }));
    console.log(get().bookmarks);
    return true;
  },
  deleteBookMark: async (bookId: number) => {
    try {
      const removedBookMark = await removeBookMark(bookId);

      if (!removedBookMark || removedBookMark.changes === 0) {
        return null;
      }
      set((state) => ({
        bookmarks: state.bookmarks.filter((i) => i.book_id !== bookId),
      }));
      console.log(get().bookmarks);

      return true;
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      return null;
    }
  },
}));
