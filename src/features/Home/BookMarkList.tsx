import { View, ViewStyle } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { LayoutTitle } from '@/components/LayoutTitle';
import { ScrollableBooks } from '../ScrollableBooks';
import { useBookStore } from '@/store/booksStore';
import { useEffect, useMemo } from 'react';
import { useBookMarkStore } from '@/store/bookMarkStore';
import NoBookmarks from './NoBookmarks';

export const BookMarkList = () => {
  const { books, loadBooks } = useBookStore();
  const { bookmarks, loadBookMarks } = useBookMarkStore();

  useEffect(() => {
    loadBooks();
    loadBookMarks();
  }, [loadBooks, loadBookMarks]);

  const bookmarkedBooks = useMemo(() => {
    const bookmarkIds = bookmarks.map((item) => item.book_id);
    return bookmarkIds
      .map((id) => books.find((book) => book.id === id))
      .filter(Boolean) as typeof books;
  }, [books, bookmarks]);

  const noBooks = books.length === 0;
  const noBookmarks = bookmarkedBooks.length === 0;

  return (
    <View
      style={
        {
          backgroundColor: 'rgba(255, 255, 255, 0.17)',
          padding: 12,
          borderRadius: 12,
          display: 'flex',
          gap: 16,
          flexDirection: 'column',
          justifyContent: 'center',
        } as ViewStyle
      }>
      <View className="flex-row items-center gap-2">
        <Feather name="bookmark" size={20} color="white" />
        <LayoutTitle size={12} title="Bookmark List" />
      </View>

      {!books || noBooks || noBookmarks ? (
        <NoBookmarks />
      ) : (
        <ScrollableBooks data={bookmarkedBooks} />
      )}
    </View>
  );
};
