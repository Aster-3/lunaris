import { LayoutTitle } from '@/components/LayoutTitle';
import { View } from 'react-native';
import { ScrollableBooks } from '../ScrollableBooks';
import { useEffect, useState } from 'react';
import { useBookStore } from '@/store/booksStore';
import { sortArrays } from '@/utils/sortBooks';
import { EmptyBooks } from '../BookTemplate/EmptyBooks';

export const RecentReadBooks = () => {
  const { books, loadBooks } = useBookStore();
  const [recentBooks, setRecentBooks] = useState<any[]>([]);
  useEffect(() => {
    loadBooks();
    if (books.length > 0 || books) {
      const sorted = sortArrays(books as any, 'recent-read');
      const limited = sorted.slice(0, 10);
      setRecentBooks(limited);
    }
  }, [books, loadBooks]);

  return (
    <View className="flex flex-col gap-4">
      <LayoutTitle title="Recent Books" />

      {!books || books.length === 0 ? (
        <EmptyBooks />
      ) : (
        <ScrollableBooks data={recentBooks} showNames={true} />
      )}
    </View>
  );
};
